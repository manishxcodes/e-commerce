import express from 'express';
import dotenv from 'dotenv';
import { connectToDB } from './db.ts'
import router from './routes/index.ts'
import { errorHandler } from 'middlewares/errorHandler.ts';

const app = express();
dotenv.config();

app.use(express.json());
app.use('/api/v1', router)

app.use(errorHandler);

const port = process.env.PORT || 3000;

app.get('/api/test', (req, res) => {
    res.json({message: "Test"})
})

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


