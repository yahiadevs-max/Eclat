import { Request, Response } from 'express';
import { pool } from '../db';

export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM payments ORDER BY payment_date DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const updatePaymentStatus = async (req: Request, res: Response) => {
    const { transactionId } = req.params;
    const { status } = req.body;
    if (!['Réussi', 'En attente', 'Échoué', 'Remboursé'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    try {
        await pool.query('UPDATE payments SET status = ? WHERE transaction_id = ?', [status, transactionId]);
        res.json({ message: 'Payment status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};