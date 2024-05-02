import {Pool} from 'pg';
import * as dotenv from 'dotenv';

dotenv.configDotenv();

export const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

export const firstAttemptFunction = async () => {
    try {
        const result = await pool.query('SELECT * FROM investigador');
        return result;
    } catch (error) {
        console.error('Error executing query', error);
    }
}

export const fetchProjectData = async () => {
    try {
        const result = await pool.query('SELECT * FROM proyecto');
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
}