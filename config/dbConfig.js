import mysql2 from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()


const host = process.env.DB_HOST;
const port = process.env.DB_PORT;
const password = process.env.DB_PASS;
const user = process.env.DB_USER;
const database = process.env.DB_NAME;

let pool;

async function connectToDB(){
    try {
        pool = mysql2.createPool({
            host,
            port,
            password,
            user,
            database,
            connectionLimit:10,
        });
        console.log("Conneceted to database Successfully");
    } catch (error) {
        console.error("Error connecting to database:",error);
        throw error;
    }
}

async function query(sql,params){
    if(!pool){
        await connectToDB();
    }
    try {
        const[rows,fields] = await pool.execute(sql,params);
        return rows;
    } catch (error) {
        console.error("Error executing query",error);
        throw error;
    }
}

export default query;