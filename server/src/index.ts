import express from 'express';
import dotenv from 'dotenv';
import { connectToDB } from './db.ts'

const app = express();
dotenv.config();

app.use(express.json());

const port = process.env.PORT || 3000;

connectToDB()
.then(() => {
    app.on("error", (error) => {
        console.log("Error while listening", {details: error})
    });

    app.listen(port, () => {
        console.log(`server running on port: ${port}`);
    })
})
.catch((err) => {
    console.log("Mongo DB connection failed \n", {details: err},);
});


