import { Request, Response } from 'express';
import { pool } from '../db';
import { RowDataPacket } from 'mysql2';

export const getShippingCosts = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM shipping_costs');
        const costs = rows.reduce((acc, row) => {
            acc[row.wilaya] = row.cost;
            return acc;
        }, {});
        res.json(costs);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const updateShippingCosts = async (req: Request, res: Response) => {
    const costs: Record<string, number> = req.body;
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for (const wilaya in costs) {
            await connection.query('UPDATE shipping_costs SET cost = ? WHERE wilaya = ?', [costs[wilaya], wilaya]);
        }
        await connection.commit();
        res.json({ message: 'Shipping costs updated successfully' });
    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).send('Server error');
    } finally {
        connection.release();
    }
};