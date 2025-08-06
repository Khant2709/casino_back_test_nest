import { pool } from './db';

export const startMysql = async () => {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log('✅ Успешное подключение к БД');
  } catch (err) {
    console.error('❌ Не удалось подключиться к БД:', err);
    throw err;
  } finally {
    if (connection) connection.release();
  }
};
