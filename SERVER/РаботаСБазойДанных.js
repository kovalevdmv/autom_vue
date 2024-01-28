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

async function УдалитьЗаписиВАгрегирующихТаблицахПоИДРегистратора(КлиентДБ, ИмяАгрегирующейТаблицы, ИДРегистратора, ТипРегистратор){
    await КлиентДБ.query(`DELETE FROM ${ИмяАгрегирующейТаблицы} AS T WHERE T.registrator_id = $1 AND registrator_type=$2`, [ИДРегистратора,ТипРегистратор]);
}

// Функция для выполнения запроса с параметрами
const ВыполнитьЗапрос = async (text, params) => {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows;
    } finally {
        client.release();
    }
};

async function НачатьТранзакцию() {
    const client = await pool.connect();
    await client.query('BEGIN;');
    return client;
}

async function ВыполнитьЗапросВТранзакции(client, text, params) {
    const res = await client.query(text, params);
    return res.rows;
}

async function ЗафиксироватьТранзакцию(client, ВернутьКлиентВПул = true) {
    await client.query('COMMIT;');
    if (ВернутьКлиентВПул)
        client.release();
    return client;
}

async function ОтменитьТранзакцию(client, ВернутьКлиентВПул = true) {
    await client.query('ROLLBACK;');
    if (ВернутьКлиентВПул)
        client.release();
    return client;
}

// RPC функция для выполнения запроса
async function ВыполнитьЗапросRPC(respons, Параметры, piscina) {
    try {
        console.log(Параметры);
        const res = await ВыполнитьЗапрос(Параметры.ТекстЗапроса, Параметры.Параметры, respons);
        respons.status(200).json(res);
    } catch (err) {
        console.error(err);
        const errorText = { Сообщение: err.message, ТекстЗапроса: Параметры.ТекстЗапроса, Параметры: Параметры.Параметры }
        respons.status(200).json({ status: 'error', message: errorText });
    }
}

export default {
    ВыполнитьЗапросRPC,
    ВыполнитьЗапрос,
    НачатьТранзакцию,
    ВыполнитьЗапросВТранзакции,
    ЗафиксироватьТранзакцию,
    ОтменитьТранзакцию,
    УдалитьЗаписиВАгрегирующихТаблицахПоИДРегистратора
};
