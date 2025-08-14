import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let pool;
export function createPool() {
  if (pool) return pool;
  pool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'blogdb',
    connectionLimit: 10,
    namedPlaceholders: true
  });
  return pool;
}
export async function query(sql, params = {}) {
  const [rows] = await createPool().execute(sql, params);
  return rows;
}
