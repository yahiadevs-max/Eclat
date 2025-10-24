import { Request, Response } from 'express';
import { pool } from '../db';

export const getAllReturnRequests = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query('SELECT * FROM return_requests ORDER BY request_date DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

export const updateReturnRequestStatus = async (req: Request, res: Response) => {
    const { requestId } = req.params;
    const { status } = req.body;
     if (!['Demandé', 'Approuvé', 'Rejeté', 'Terminé'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    try {
        await pool.query('UPDATE return_requests SET status = ? WHERE request_id = ?', [status, requestId]);
        res.json({ message: 'Return request status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};