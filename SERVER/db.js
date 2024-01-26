import sqlite3 from'sqlite3';
import { open } from'sqlite';

async function openDb() {
    return open({
        filename: './mydb.sqlite',
        driver: sqlite3.Database
    });
}

async function queryDatabase(query, params) {
    const db = await openDb();
    try {
        const result = await db.all(query, params);
        return result;
    } finally {
        await db.close();
    }
}

export { queryDatabase };