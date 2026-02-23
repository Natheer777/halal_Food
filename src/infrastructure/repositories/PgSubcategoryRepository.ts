import { Pool } from "pg";
import { Subcategory } from "@domain/entities/Subcategory";
import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";

export class PgSubcategoryRepository implements ISubcategoryRepository {
  constructor(private readonly pool: Pool) { }

  async create(subcategory: Subcategory): Promise<Subcategory> {
    const query = `
      INSERT INTO subcategories (id, main_category_id, name, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id, main_category_id, name, created_at;
    `;

    const values = [subcategory.id, subcategory.mainCategoryId, subcategory.name, subcategory.createdAt];

    const result = await this.pool.query(query, values);
    const row = result.rows[0];

    return {
      id: row.id,
      mainCategoryId: row.main_category_id,
      name: row.name,
      createdAt: row.created_at
    };
  }

  async findByMainCategoryIds(mainCategoryIds: string[]): Promise<Subcategory[]> {
    if (mainCategoryIds.length === 0) {
      return [];
    }

    const query = `
      SELECT id, main_category_id, name, created_at
      FROM subcategories
      WHERE main_category_id = ANY($1::uuid[])
      ORDER BY created_at ASC;
    `;

    const result = await this.pool.query(query, [mainCategoryIds]);

    return result.rows.map((row) => ({
      id: row.id,
      mainCategoryId: row.main_category_id,
      name: row.name,
      createdAt: row.created_at
    }));
  }

  async findById(id: string): Promise<Subcategory | null> {
    const result = await this.pool.query(
      `
        SELECT id, main_category_id, name, created_at
        FROM subcategories
        WHERE id = $1;
      `,
      [id]
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      mainCategoryId: row.main_category_id,
      name: row.name,
      createdAt: row.created_at
    };
  }

  async update(subcategory: Subcategory): Promise<Subcategory> {
    const result = await this.pool.query(
      `
        UPDATE subcategories
        SET main_category_id = $2,
            name = $3
        WHERE id = $1
        RETURNING id, main_category_id, name, created_at;
      `,
      [subcategory.id, subcategory.mainCategoryId, subcategory.name]
    );

    const row = result.rows[0];

    return {
      id: row.id,
      mainCategoryId: row.main_category_id,
      name: row.name,
      createdAt: row.created_at
    };
  }

  async delete(id: string): Promise<void> {
    await this.pool.query(
      `
        DELETE FROM subcategories
        WHERE id = $1;
      `,
      [id]
    );
  }

  async findByName(name: string): Promise<Subcategory | null> {
    const result = await this.pool.query(
      `
        SELECT id, main_category_id, name, created_at
        FROM subcategories
        WHERE name = $1;
      `,
      [name]
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      mainCategoryId: row.main_category_id,
      name: row.name,
      createdAt: row.created_at
    };
  }

  async findWithPagination(page: number, limit: number): Promise<{ subcategories: Subcategory[], total: number }> {
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) FROM subcategories;`;
    const subcategoriesQuery = `
      SELECT id, main_category_id as "mainCategoryId", name, created_at as "createdAt"
      FROM subcategories
      ORDER BY created_at ASC
      LIMIT $1 OFFSET $2;
    `;

    const [countResult, subcategoriesResult] = await Promise.all([
      this.pool.query(countQuery),
      this.pool.query(subcategoriesQuery, [limit, offset])
    ]);

    return {
      subcategories: subcategoriesResult.rows,
      total: parseInt(countResult.rows[0].count, 10)
    };
  }
}

