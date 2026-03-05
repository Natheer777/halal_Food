import { Pool } from "pg";

export async function up(pool: Pool): Promise<void> {
  await pool.query(`
    DO $$ BEGIN
      CREATE TYPE offer_status AS ENUM ('active', 'inactive');
    EXCEPTION
      WHEN duplicate_object THEN null;
    END $$;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS offers (
      id UUID PRIMARY KEY,
      product_id UUID NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
      discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
      description TEXT,
      status offer_status NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(pool: Pool): Promise<void> {
  await pool.query(`DROP TABLE IF EXISTS offers;`);
  await pool.query(`DROP TYPE IF EXISTS offer_status;`);
}
