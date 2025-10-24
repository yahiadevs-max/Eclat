
import express from 'express';
import { pool } from '../db';
import { RowDataPacket } from 'mysql2';

const BASE_PRODUCT_QUERY = `
    SELECT
        p.id,
        p.name,
        p.price,
        p.description,
        p.stock,
        p.rating,
        p.reviews,
        b.name as brand,
        c.name as category,
        sc.name as subcategory,
        (
            SELECT JSON_ARRAYAGG(image_url)
            FROM product_images pi
            WHERE pi.product_id = p.id
        ) as images,
        (
            SELECT JSON_ARRAYAGG(size)
            FROM product_sizes ps
            WHERE ps.product_id = p.id
        ) as sizes,
        (
            SELECT JSON_ARRAYAGG(color)
            FROM product_colors pc
            WHERE pc.product_id = p.id
        ) as colors
    FROM
        products p
    LEFT JOIN brands b ON p.brand_id = b.id
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
`;

const processProductRows = (rows: any[]) => {
    return rows.map(row => ({
        ...row,
        images: row.images || [], // JSON_ARRAYAGG returns null for no rows, default to empty array
        sizes: row.sizes || [],
        colors: row.colors || []
    }));
};

export const getAllProducts = async (req: express.Request, res: express.Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(BASE_PRODUCT_QUERY);
        res.json(processProductRows(rows));
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ message: 'Error fetching products from the database' });
    }
};

export const getProductById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const query = `${BASE_PRODUCT_QUERY} WHERE p.id = ?`;
        const [rows] = await pool.query<RowDataPacket[]>(query, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(processProductRows(rows)[0]);
    } catch (error) {
        console.error(`Failed to fetch product ${id}:`, error);
        res.status(500).json({ message: 'Error fetching product from the database' });
    }
};