import { Pool } from "pg";

export async function up(pool: Pool): Promise<void> {
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE product_status AS ENUM ('visible', 'hidden');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id UUID PRIMARY KEY,
      name TEXT NOT NULL,
      subcategory_id UUID NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
      manufacturing_location TEXT NOT NULL,
      available_quantity INTEGER NOT NULL DEFAULT 0,
      price DECIMAL(10, 2) NOT NULL,
      size TEXT NOT NULL,
      description TEXT,
      status product_status NOT NULL DEFAULT 'visible',
      images JSONB DEFAULT '[]'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS products;`);
  await pool.query(`DROP TYPE IF EXISTS product_status;`);
}
