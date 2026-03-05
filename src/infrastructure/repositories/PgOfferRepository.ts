import { Pool } from "pg";
import { Offer } from "@domain/entities/Offer";
import { IOfferRepository } from "@domain/repositories/IOfferRepository";

export class PgOfferRepository implements IOfferRepository {
    constructor(private readonly pool: Pool) { }

    async create(offer: Omit<Offer, 'product' | 'createdAt'>): Promise<Offer> {
        const query = `
            INSERT INTO offers (id, product_id, discount_percentage, description, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, product_id as "productId", discount_percentage as "discountPercentage", description, status, created_at as "createdAt";
        `;
        const values = [offer.id, offer.productId, offer.discountPercentage, offer.description, offer.status];
        const result = await this.pool.query(query, values);
        return result.rows[0];
    }

    async findAll(): Promise<Offer[]> {
        const query = `
            SELECT o.id, o.product_id as "productId", o.discount_percentage as "discountPercentage", 
                   o.description, o.status, o.created_at as "createdAt",
                   p.id as "p_id", p.name as "p_name", s.name as "p_subcategoryName",
                   p.manufacturing_location as "p_manufacturingLocation", p.available_quantity as "p_availableQuantity",
                   p.price as "p_price", p.size as "p_size", p.description as "p_description",
                   p.status as "p_status", p.images as "p_images", p.created_at as "p_createdAt"
            FROM offers o
            JOIN products p ON o.product_id = p.id
            JOIN subcategories s ON p.subcategory_id = s.id
            ORDER BY o.created_at DESC;
        `;
        const result = await this.pool.query(query);
        return result.rows.map(row => ({
            id: row.id,
            productId: row.productId,
            discountPercentage: row.discountPercentage,
            description: row.description,
            status: row.status,
            createdAt: row.createdAt,
            product: {
                id: row.p_id,
                name: row.p_name,
                subcategoryName: row.p_subcategoryName,
                manufacturingLocation: row.p_manufacturingLocation,
                availableQuantity: row.p_availableQuantity,
                price: row.p_price,
                size: row.p_size,
                description: row.p_description,
                status: row.p_status,
                images: row.p_images,
                createdAt: row.p_createdAt
            }
        }));
    }

    async findById(id: string): Promise<Offer | null> {
        const query = `
            SELECT o.id, o.product_id as "productId", o.discount_percentage as "discountPercentage", 
                   o.description, o.status, o.created_at as "createdAt",
                   p.id as "p_id", p.name as "p_name", s.name as "p_subcategoryName",
                   p.manufacturing_location as "p_manufacturingLocation", p.available_quantity as "p_availableQuantity",
                   p.price as "p_price", p.size as "p_size", p.description as "p_description",
                   p.status as "p_status", p.images as "p_images", p.created_at as "p_createdAt"
            FROM offers o
            JOIN products p ON o.product_id = p.id
            JOIN subcategories s ON p.subcategory_id = s.id
            WHERE o.id = $1;
        `;
        const result = await this.pool.query(query, [id]);
        if (result.rows.length === 0) return null;
        const row = result.rows[0];
        return {
            id: row.id,
            productId: row.productId,
            discountPercentage: row.discountPercentage,
            description: row.description,
            status: row.status,
            createdAt: row.createdAt,
            product: {
                id: row.p_id,
                name: row.p_name,
                subcategoryName: row.p_subcategoryName,
                manufacturingLocation: row.p_manufacturingLocation,
                availableQuantity: row.p_availableQuantity,
                price: row.p_price,
                size: row.p_size,
                description: row.p_description,
                status: row.p_status,
                images: row.p_images,
                createdAt: row.p_createdAt
            }
        };
    }

    async findByProductId(productId: string): Promise<Offer | null> {
        const query = `
            SELECT id, product_id as "productId", discount_percentage as "discountPercentage", 
                   description, status, created_at as "createdAt"
            FROM offers
            WHERE product_id = $1;
        `;
        const result = await this.pool.query(query, [productId]);
        return result.rows[0] || null;
    }

    async update(offer: Partial<Offer> & { id: string }): Promise<Offer> {
        const query = `
            UPDATE offers
            SET discount_percentage = COALESCE($2, discount_percentage),
                description = COALESCE($3, description),
                status = COALESCE($4, status)
            WHERE id = $1
            RETURNING id, product_id as "productId", discount_percentage as "discountPercentage", 
                      description, status, created_at as "createdAt";
        `;
        const result = await this.pool.query(query, [offer.id, offer.discountPercentage, offer.description, offer.status]);
        return result.rows[0];
    }

    async delete(id: string): Promise<void> {
        await this.pool.query('DELETE FROM offers WHERE id = $1', [id]);
    }

    async findActiveWithPagination(page: number, limit: number): Promise<{ offers: Offer[], total: number }> {
        const offset = (page - 1) * limit;
        const query = `
            SELECT o.id, o.product_id as "productId", o.discount_percentage as "discountPercentage", 
                   o.description, o.status, o.created_at as "createdAt",
                   p.id as "p_id", p.name as "p_name", s.name as "p_subcategoryName",
                   p.manufacturing_location as "p_manufacturingLocation", p.available_quantity as "p_availableQuantity",
                   p.price as "p_price", p.size as "p_size", p.description as "p_description",
                   p.status as "p_status", p.images as "p_images", p.created_at as "p_createdAt",
                   COUNT(*) OVER() as total_count
            FROM offers o
            JOIN products p ON o.product_id = p.id
            JOIN subcategories s ON p.subcategory_id = s.id
            WHERE o.status = 'active'
            ORDER BY o.created_at DESC
            LIMIT $1 OFFSET $2;
        `;
        const result = await this.pool.query(query, [limit, offset]);
        const total = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
        const offers = result.rows.map(row => ({
            id: row.id,
            productId: row.productId,
            discountPercentage: row.discountPercentage,
            description: row.description,
            status: row.status,
            createdAt: row.createdAt,
            product: {
                id: row.p_id,
                name: row.p_name,
                subcategoryName: row.p_subcategoryName,
                manufacturingLocation: row.p_manufacturingLocation,
                availableQuantity: row.p_availableQuantity,
                price: row.p_price,
                size: row.p_size,
                description: row.p_description,
                status: row.p_status,
                images: row.p_images,
                createdAt: row.p_createdAt
            }
        }));
        return { offers, total };
    }
}
