import express from 'express';
import dotenv from  'dotenv';
dotenv.config();
import cors from 'cors';


const app = express();
const host = process.env.DB_HOST;
const port = process.env.DB_PORT;

const corsOptions = {
    origin: true,
    Credentials:true,
}

// allow cross origin resource sharing
app.use(cors(corsOptions));

// allow json data
app.use(express.json());

// Middleware to parse URL-encoded data
app.use(express.urlencoded({extended:true}))

app.get("/",(req,res) =>{
    res.send("Server is running");
})

app.listen(port,host,() =>{
    console.log(`Server is running at http://${host}:${port}`);
})