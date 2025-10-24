
import express from 'express';
import { pool } from '../db';
import { RowDataPacket, OkPacket } from 'mysql2';

interface OrderItem {
    product: { id: number };
    quantity: number;
}

interface OrderPayload {
    customerDetails: {
        firstname: string;
        lastname: string;
    };
    orderItems: OrderItem[];
    total: number;
}

export const createOrder = async (req: express.Request, res: express.Response) => {
    const { customerDetails, orderItems, total } = req.body as OrderPayload;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Find or create customer
        const customerName = `${customerDetails.firstname} ${customerDetails.lastname}`;
        let [customerRows] = await connection.query<RowDataPacket[]>('SELECT id FROM customers WHERE name = ?', [customerName]);
        let customerId;

        if (customerRows.length > 0) {
            customerId = customerRows[0].id;
        } else {
            const [newCustomer] = await connection.query<OkPacket>('INSERT INTO customers (name) VALUES (?)', [customerName]);
            customerId = newCustomer.insertId;
        }

        // 2. Create the order
        const orderId = `#${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await connection.query('INSERT INTO orders (id, customer_id, order_date, total, status) VALUES (?, ?, CURDATE(), ?, ?)', [
            orderId,
            customerId,
            total,
            'En attente'
        ]);

        // 3. Process order items and update stock
        for (const item of orderItems) {
            const [productRows] = await connection.query<RowDataPacket[]>('SELECT stock FROM products WHERE id = ? FOR UPDATE', [item.product.id]);
            
            if (productRows.length === 0 || productRows[0].stock < item.quantity) {
                await connection.rollback();
                return res.status(400).json({ message: `Stock insuffisant pour le produit ID ${item.product.id}` });
            }

            await connection.query('UPDATE products SET stock = stock - ? WHERE id = ?', [item.quantity, item.product.id]);
            await connection.query('INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)', [orderId, item.product.id, item.quantity]);
        }
        
        await connection.commit();
        res.status(201).json({ message: 'Commande créée avec succès', orderId: orderId });

    } catch (error) {
        await connection.rollback();
        console.error('Failed to create order:', error);
        res.status(500).json({ message: 'Erreur lors de la création de la commande' });
    } finally {
        connection.release();
    }
};