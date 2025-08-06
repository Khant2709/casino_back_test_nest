import mysql, {Pool} from 'mysql2/promise';
import {DB_DATABASE, DB_HOST, DB_PASSWORD, DB_USER, DB_PORT} from "@constants/envData";

export const pool: Pool = mysql.createPool({
  host: DB_HOST,
  port: Number(DB_PORT),
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

