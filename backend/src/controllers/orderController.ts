import { Request, Response } from 'express';
import { pool } from '../db';
import { RowDataPacket, OkPacket } from 'mysql2';

interface OrderItem {
    product: { id: number; price: number; };
    quantity: number;
}

interface OrderPayload {
    customerDetails: {
        firstname: string;
        lastname: string;
        phone: string;
        email: string;
        country: string;
        city: string;
        commune: string;
        address: string;
    };
    orderItems: OrderItem[];
    total: number;
}

export const createOrder = async (req: Request, res: Response) => {
    const { customerDetails, orderItems, total } = req.body as OrderPayload;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 1. Find or create customer
        let [customerRows] = await connection.query<RowDataPacket[]>('SELECT id FROM customers WHERE email = ?', [customerDetails.email]);
        let customerId;

        if (customerRows.length > 0) {
            customerId = customerRows[0].id;
        } else {
            const [newCustomer] = await connection.query<OkPacket>(
                'INSERT INTO customers (name, firstname, lastname, phone, email, country, city, commune, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', 
                [`${customerDetails.firstname} ${customerDetails.lastname}`, customerDetails.firstname, customerDetails.lastname, customerDetails.phone, customerDetails.email, customerDetails.country, customerDetails.city, customerDetails.commune, customerDetails.address]
            );
            customerId = newCustomer.insertId;
        }

        // 2. Create the order
        const orderId = `#${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        await connection.query('INSERT INTO orders (id, customer_id, order_date, total, status) VALUES (?, ?, NOW(), ?, ?)', [
            orderId,
            customerId,
            total,
            'En attente'
        ]);

        // 3. Process order items and update stock
        for (const item of orderItems) {
            await connection.query('UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?', [item.quantity, item.product.id, item.quantity]);
            
            const [updatedRows] = await connection.query<OkPacket>('SELECT ROW_COUNT() as count');
            // @ts-ignore
            if (updatedRows[0].count === 0) {
                 await connection.rollback();
                return res.status(400).json({ message: `Stock insuffisant pour le produit ID ${item.product.id}` });
            }

            await connection.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, item.product.id, item.quantity, item.product.price]);
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

export const getAllOrders = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(`
            SELECT o.id, c.name as customerName, o.order_date as date, o.total, o.status 
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            ORDER BY o.order_date DESC
        `);
        res.json(rows);
    } catch (error) {
        console.error('Failed to fetch orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['En attente', 'Expédiée', 'Livrée', 'Annulée'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }

    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.status(200).json({ message: 'Order status updated' });
    } catch (error) {
        console.error(`Failed to update order ${id}:`, error);
        res.status(500).json({ message: 'Error updating order status' });
    }
};