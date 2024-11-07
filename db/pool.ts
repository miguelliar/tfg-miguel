import {Pool} from 'pg';
import {configDotenv} from 'dotenv';

let pool: Pool;

export const getPool = () => {
    if (!pool) {
        configDotenv();
    
        pool = new Pool({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: Number(process.env.DB_PORT),
        });    
    }
    return pool;
}
