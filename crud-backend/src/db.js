import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

console.log("MySQL conectado");

export const query = async (sql, params = []) => {
  const [rows] = await connection.execute(sql, params);

  return {
    rows,
    rowCount: Array.isArray(rows)
      ? rows.length
      : rows.affectedRows
  };
};