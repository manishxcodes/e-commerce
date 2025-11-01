import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        const connectionString = process.env.MONGO_URI;
        if(connectionString) {
            console.log("connectionString: ", connectionString);
            const connectionInstance = await mongoose.connect(`${connectionString}/e-comm`);  
            console.log(`\n Database connected: \n DB host: ${connectionInstance.connection.host}`);
        } else {
            throw new Error("MongoDB connection string is missing")
        }
    } catch(err) {
        console.log("Mongo DB connection failed", {details: err});
        process.exit(1);
    }
}