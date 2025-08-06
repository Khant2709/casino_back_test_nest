import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '@config/db';

type QueryResult<T> = {
    data: T | null;
    status: number;
    message?: string;
};

interface ExecuteQueryOptions {
    isMutating?: boolean;
    skipEmptyCheck?: boolean;
}

export const executeQuery = async <T extends RowDataPacket[] | ResultSetHeader>(
  query: string,
  values: any[] = [],
  options: ExecuteQueryOptions = {}
): Promise<QueryResult<T>> => {
    const { isMutating = false, skipEmptyCheck = false } = options;
    let connection;

    try {
        connection = await pool.getConnection();

        const [rows] = await connection.execute(query, values);
        const result = rows as T;

        if (isMutating) {
            const affected = (result as ResultSetHeader).affectedRows;
            if (!affected) {
                console.warn(`[SQL-FAIL] Ошибка в модификации данных: ${query}`);
                return { data: null, status: 400, message: 'Данные не изменены' };
            }
            console.info(`[SQL-SUCCESS] Успешная модификация данных: ${query}`);
            return { data: result, status: 200, message: 'Запрос успешно выполнен' };
        }

        if (Array.isArray(result) && result.length === 0) {
            if (skipEmptyCheck) {
                return {
                    data: ([] as unknown) as T,
                    status: 204,
                    message: 'Данные не найдены (это нормально)',
                };
            }
            console.info(`[SQL-EMPTY] Ответ с запроса пустой: ${query}`);
            return { data: null, status: 404, message: 'Данные не найдены' };
        }

        console.info(`[SQL-SUCCESS] Запрос прошел успешно: ${query}`);
        return { data: result, status: 200, message: 'Запрос успешно выполнен' };
    } catch (error: unknown) {
        const err = error as Error;
        console.error(`[SQL-ERROR] Ошибка в запросе: ${query}`, err);
        return { data: null, status: 500, message: `Ошибка базы данных: ${err.message}` };
    } finally {
        connection?.release();
    }
};
