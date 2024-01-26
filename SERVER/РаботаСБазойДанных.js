// Импортируем Pool из библиотеки pg
import pkg from 'pg';
const { Pool } = pkg;

// Создаем новый пул соединений
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'test',
    password: '1',
    port: 5432,
});

// Функция для выполнения запроса с параметрами
const queryDatabase = async (text, params) => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows;
    } finally {
        client.release();
    }
};

// RPC функция для выполнения запроса
async function ВыполнитьЗапросRPC(respons, Параметры) {
    try {
        console.log(Параметры);
        const res = await queryDatabase(Параметры.ТекстЗапроса, Параметры.Параметры, respons);
        respons.status(200).json(res);
    } catch (err) {
        console.error(err);
        respons.status(200).json({ status: 'error', message: err.message });
    }
}

export default { ВыполнитьЗапросRPC };
