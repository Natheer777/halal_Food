import { Pool } from "pg";
import { MainCategory } from "@domain/entities/MainCategory";
import { IMainCategoryRepository } from "@domain/repositories/IMainCategoryRepository";

export class PgMainCategoryRepository implements IMainCategoryRepository {
  constructor(private readonly pool: Pool) { }

  async create(mainCategory: MainCategory): Promise<MainCategory> {
    const query = `
      INSERT INTO main_categories (id, name, image_url, created_at)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, image_url, created_at;
    `;

    const values = [mainCategory.id, mainCategory.name, mainCategory.imageUrl, mainCategory.createdAt];

    const result = await this.pool.query(query, values);
    const row = result.rows[0];

    return {
      id: row.id,
      name: row.name,
      imageUrl: row.image_url,
      createdAt: row.created_at
    };
  }

  async findById(id: string): Promise<MainCategory | null> {
    const result = await this.pool.query(
      `
        SELECT id, name, image_url, created_at
        FROM main_categories
        WHERE id = $1
      `,
      [id]
    );

    const row = result.rows[0];
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      name: row.name,
      imageUrl: row.image_url,
      createdAt: row.created_at
    };
  }

  async findAll(): Promise<MainCategory[]> {
    const result = await this.pool.query(
      `
        SELECT id, name, image_url, created_at
        FROM main_categories
        ORDER BY created_at ASC;
      `
    );

    return result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      imageUrl: row.image_url,
      createdAt: row.created_at
    }));
  }

  async update(mainCategory: MainCategory): Promise<MainCategory> {
    const result = await this.pool.query(
      `
        UPDATE main_categories
        SET name = $2,
            image_url = $3
        WHERE id = $1
        RETURNING id, name, image_url, created_at;
      `,
      [mainCategory.id, mainCategory.name, mainCategory.imageUrl]
    );

    const row = result.rows[0];

    return {
      id: row.id,
      name: row.name,
      imageUrl: row.image_url,
      createdAt: row.created_at
    };
  }

  async delete(id: string): Promise<void> {
    await this.pool.query(
      `
        DELETE FROM main_categories
        WHERE id = $1;
      `,
      [id]
    );
  }

  async findWithPagination(page: number, limit: number): Promise<{ categories: MainCategory[], total: number }> {
    const offset = (page - 1) * limit;

    const countQuery = `SELECT COUNT(*) FROM main_categories;`;
    const categoriesQuery = `
      SELECT id, name, image_url as "imageUrl", created_at as "createdAt"
      FROM main_categories
      ORDER BY created_at ASC
      LIMIT $1 OFFSET $2;
    `;

    const [countResult, categoriesResult] = await Promise.all([
      this.pool.query(countQuery),
      this.pool.query(categoriesQuery, [limit, offset])
    ]);

    return {
      categories: categoriesResult.rows,
      total: parseInt(countResult.rows[0].count, 10)
    };
  }
}

