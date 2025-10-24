import { Request, Response } from 'express';
import { pool } from '../db';
import { RowDataPacket, OkPacket } from 'mysql2';
import bcrypt from 'bcryptjs';

export const getAllAdmins = async (req: Request, res: Response) => {
    try {
        const [admins] = await pool.query<RowDataPacket[]>("SELECT id, username, email, role FROM admins");
        // Fetch permissions for each admin
        for (let admin of admins) {
            if (admin.role === 'admin') {
                const [permissions] = await pool.query<RowDataPacket[]>('SELECT permission FROM admin_permissions WHERE admin_id = ?', [admin.id]);
                admin.permissions = permissions.reduce((acc, p) => ({ ...acc, [p.permission]: true }), {});
            }
        }
        res.json(admins);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const createAdmin = async (req: Request, res: Response) => {
    const { username, email, password, role, permissions } = req.body;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);
        
        const [result] = await connection.query<OkPacket>('INSERT INTO admins (username, email, password_hash, role) VALUES (?, ?, ?, ?)', [username, email, password_hash, role]);
        const adminId = result.insertId;

        if (role === 'admin' && permissions) {
            const permValues = Object.keys(permissions).filter(k => permissions[k]).map(p => [adminId, p]);
            if (permValues.length > 0) {
                await connection.query('INSERT INTO admin_permissions (admin_id, permission) VALUES ?', [permValues]);
            }
        }

        await connection.commit();
        res.status(201).json({ id: adminId, username, email, role });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).send('Server error');
    } finally {
        connection.release();
    }
};

export const updateAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { email, role, permissions } = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        await connection.query('UPDATE admins SET email = ?, role = ? WHERE id = ?', [email, role, id]);
        await connection.query('DELETE FROM admin_permissions WHERE admin_id = ?', [id]);

        if (role === 'admin' && permissions) {
             const permValues = Object.keys(permissions).filter(k => permissions[k]).map(p => [id, p]);
            if (permValues.length > 0) {
                await connection.query('INSERT INTO admin_permissions (admin_id, permission) VALUES ?', [permValues]);
            }
        }
        await connection.commit();
        res.status(200).json({ message: 'Admin updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).send('Server error');
    } finally {
        connection.release();
    }
};

export const deleteAdmin = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [admin] = await pool.query<RowDataPacket[]>('SELECT role FROM admins WHERE id = ?', [id]);
        if (admin.length === 0) return res.status(404).send('Admin not found');
        if (admin[0].role === 'superadmin') return res.status(400).send('Cannot delete a superadmin');

        await pool.query('DELETE FROM admins WHERE id = ?', [id]);
        res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};