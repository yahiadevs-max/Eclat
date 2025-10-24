import { Request, Response } from 'express';
import { pool } from '../db';

export const getAllDeliveries = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM deliveries');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const updateDeliveryStatus = async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status } = req.body;
     if (!['Préparation', 'Expédiée', 'En transit', 'Livrée'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    try {
        await pool.query('UPDATE deliveries SET status = ? WHERE order_id = ?', [status, orderId]);
        res.json({ message: 'Delivery status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};