import { Pool } from "pg";
import { Product, ProductStatus } from "@domain/entities/Product";
import { IProductRepository } from "@domain/repositories/IProductRepository";

export class PgProductRepository implements IProductRepository {
  constructor(private readonly pool: Pool) { }

  async create(product: Omit<Product, 'subcategoryName'>, subcategoryId: string): Promise<Product> {
    const query = `
      WITH inserted AS (
        INSERT INTO products (
          id, name, subcategory_id, manufacturing_location, 
          available_quantity, price, size, description, status, images, created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      )
      SELECT i.id, i.name, 
             s.name as "subcategoryName",
             i.manufacturing_location as "manufacturingLocation", 
             i.available_quantity as "availableQuantity", 
             i.price, i.size, i.description, i.status, i.images, i.created_at as "createdAt"
      FROM inserted i
      JOIN subcategories s ON i.subcategory_id = s.id;
    `;

    const values = [
      product.id,
      product.name,
      subcategoryId,
      product.manufacturingLocation,
      product.availableQuantity,
      product.price,
      product.size,
      product.description,
      product.status,
      JSON.stringify(product.images),
      product.createdAt
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findById(id: string): Promise<Product | null> {
    const query = `
      SELECT p.id, p.name, 
             s.name as "subcategoryName",
             p.manufacturing_location as "manufacturingLocation", 
             p.available_quantity as "availableQuantity", 
             p.price, p.size, p.description, p.status, p.images, p.created_at as "createdAt"
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      WHERE p.id = $1;
    `;

    const result = await this.pool.query(query, [id]);
    const row = result.rows[0];

    if (!row) {
      return null;
    }

    return row;
  }

  async findAll(): Promise<Product[]> {
    const query = `
      SELECT p.id, p.name, 
             s.name as "subcategoryName",
             p.manufacturing_location as "manufacturingLocation", 
             p.available_quantity as "availableQuantity", 
             p.price, p.size, p.description, p.status, p.images, p.created_at as "createdAt"
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      ORDER BY p.created_at DESC;
    `;

    const result = await this.pool.query(query);
    return result.rows;
  }

  async update(product: Omit<Product, 'subcategoryName'>, subcategoryId: string): Promise<Product> {
    const query = `
      WITH updated AS (
        UPDATE products
        SET name = $2,
            subcategory_id = $3,
            manufacturing_location = $4,
            available_quantity = $5,
            price = $6,
            size = $7,
            description = $8,
            status = $9,
            images = $10
        WHERE id = $1
        RETURNING *
      )
      SELECT u.id, u.name, 
             s.name as "subcategoryName",
             u.manufacturing_location as "manufacturingLocation", 
             u.available_quantity as "availableQuantity", 
             u.price, u.size, u.description, u.status, u.images, u.created_at as "createdAt"
      FROM updated u
      JOIN subcategories s ON u.subcategory_id = s.id;
    `;

    const values = [
      product.id,
      product.name,
      subcategoryId,
      product.manufacturingLocation,
      product.availableQuantity,
      product.price,
      product.size,
      product.description,
      product.status,
      JSON.stringify(product.images)
    ];

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    const query = `DELETE FROM products WHERE id = $1;`;
    await this.pool.query(query, [id]);
  }

  async findBySubcategoryId(subcategoryId: string): Promise<Product[]> {
    const query = `
      SELECT p.id, p.name, 
             s.name as "subcategoryName",
             p.manufacturing_location as "manufacturingLocation", 
             p.available_quantity as "availableQuantity", 
             p.price, p.size, p.description, p.status, p.images, p.created_at as "createdAt"
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      WHERE p.subcategory_id = $1
      ORDER BY p.created_at DESC;
    `;

    const result = await this.pool.query(query, [subcategoryId]);
    return result.rows;
  }

  async findVisibleWithPagination(page: number, limit: number): Promise<{ products: Product[], total: number }> {
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) FROM products WHERE status = 'visible';`;
    const productsQuery = `
      SELECT p.id, p.name, 
             s.name as "subcategoryName",
             p.manufacturing_location as "manufacturingLocation", 
             p.available_quantity as "availableQuantity", 
             p.price, p.size, p.description, p.status, p.images, p.created_at as "createdAt"
      FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      WHERE p.status = 'visible'
      ORDER BY p.created_at DESC
      LIMIT $1 OFFSET $2;
    `;

    const [countResult, productsResult] = await Promise.all([
      this.pool.query(countQuery),
      this.pool.query(productsQuery, [limit, offset])
    ]);

    return {
      products: productsResult.rows,
      total: parseInt(countResult.rows[0].count, 10)
    };
  }
}
