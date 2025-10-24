import { Request, Response } from 'express';
import { pool } from '../db';
import { RowDataPacket, OkPacket } from 'mysql2';

interface ProductPayload {
    name: string;
    brand: string;
    price: number;
    category: string;
    subcategory?: string;
    description: string;
    stock: number;
    images?: string[];
    sizes?: string[];
    colors?: string[];
}

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

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.query<RowDataPacket[]>(BASE_PRODUCT_QUERY);
        res.json(processProductRows(rows));
    } catch (error) {
        console.error('Failed to fetch products:', error);
        res.status(500).json({ message: 'Error fetching products from the database' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
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

export const createProduct = async (req: Request, res: Response) => {
    const { name, brand, price, category, subcategory, description, stock, images, sizes, colors } = req.body as ProductPayload;
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const getOrCreateId = async (tableName: string, name: string) => {
            const [rows] = await connection.query<RowDataPacket[]>(`SELECT id FROM ${tableName} WHERE name = ?`, [name]);
            if (rows.length > 0) return rows[0].id;
            const [result] = await connection.query<OkPacket>(`INSERT INTO ${tableName} (name) VALUES (?)`, [name]);
            return result.insertId;
        };

        const brandId = await getOrCreateId('brands', brand);
        const categoryId = await getOrCreateId('categories', category);
        let subcategoryId = null;
        if (subcategory) {
            const [rows] = await connection.query<RowDataPacket[]>(`SELECT id FROM subcategories WHERE name = ? AND category_id = ?`, [subcategory, categoryId]);
            if (rows.length > 0) {
                subcategoryId = rows[0].id;
            } else {
                const [result] = await connection.query<OkPacket>(`INSERT INTO subcategories (name, category_id) VALUES (?, ?)`, [subcategory, categoryId]);
                subcategoryId = result.insertId;
            }
        }
        
        const newProductId = Math.floor(Math.random() * 1000000); // Temporary ID generation

        await connection.query(
            'INSERT INTO products (id, name, brand_id, price, category_id, subcategory_id, description, stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [newProductId, name, brandId, price, categoryId, subcategoryId, description, stock]
        );

        if (images && images.length > 0) {
            const imageValues = images.map(url => [newProductId, url]);
            await connection.query('INSERT INTO product_images (product_id, image_url) VALUES ?', [imageValues]);
        }
        if (sizes && sizes.length > 0) {
            const sizeValues = sizes.map(s => [newProductId, s]);
            await connection.query('INSERT INTO product_sizes (product_id, size) VALUES ?', [sizeValues]);
        }
        if (colors && colors.length > 0) {
            const colorValues = colors.map(c => [newProductId, c]);
            await connection.query('INSERT INTO product_colors (product_id, color) VALUES ?', [colorValues]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Product created successfully', productId: newProductId });

    } catch (error) {
        await connection.rollback();
        console.error('Failed to create product:', error);
        res.status(500).json({ message: 'Error creating product' });
    } finally {
        connection.release();
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    // This is a simplified update. A full implementation would be more complex.
    const { id } = req.params;
    const { stock, price } = req.body;

    try {
        await pool.query('UPDATE products SET stock = ?, price = ? WHERE id = ?', [stock, price, id]);
        res.status(200).json({ message: `Product ${id} updated.` });
    } catch (error) {
        console.error(`Failed to update product ${id}:`, error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        // ON DELETE CASCADE will handle related tables
        const [result] = await pool.query<OkPacket>('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(`Failed to delete product ${id}:`, error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};