
import { Request, Response } from 'express';
import { pool } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

interface Admin extends RowDataPacket {
    id: number;
    username: string;
    password_hash: string;
    role: 'superadmin' | 'admin';
}

interface Permission extends RowDataPacket {
    permission: string;
}

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Nom d'utilisateur et mot de passe requis." });
    }

    try {
        const [rows] = await pool.query<Admin[]>('SELECT * FROM admins WHERE username = ?', [username]);
        const admin = rows[0];

        if (!admin) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        const isMatch = await bcrypt.compare(password, admin.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        // Fetch permissions for 'admin' role
        let permissions: { [key: string]: boolean } = {};
        if (admin.role === 'admin') {
            const [permRows] = await pool.query<Permission[]>('SELECT permission FROM admin_permissions WHERE admin_id = ?', [admin.id]);
            permRows.forEach(p => {
                permissions[p.permission] = true;
            });
        }
        
        const payload = {
            id: admin.id,
            username: admin.username,
            role: admin.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '8h' });

        const userResponse = {
            username: admin.username,
            role: admin.role,
            ...(admin.role === 'admin' && { permissions })
        };

        res.json({ token, user: userResponse });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Erreur du serveur lors de la connexion.' });
    }
};
