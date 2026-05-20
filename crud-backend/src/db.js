import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export const query = async (sql, params = []) => {
  const result = await pool.query(sql, params);

  return {
    rows: result.rows,
    rowCount: result.rowCount,
  };
};