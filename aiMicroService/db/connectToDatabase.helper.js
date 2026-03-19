import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { DB_NAME } from "./constants.js";

const connectToDB = async () => {
    try{
        const mongoUri = process.env.MONGODB_URL;
        if (!mongoUri) {
            throw new Error("MONGODB_URL is missing in ai.env");
        }

        const conn = await mongoose.connect(mongoUri);
        console.log("Connected to the database successfully,", conn.connection.host);

    }catch(err){
        console.error(`Error connecting to the database (${DB_NAME})`, err);
        process.exit(1)
    }
}

// Allow running this file directly for a quick connectivity check.
const isDirectRun = fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
    connectToDB();
}
export default connectToDB;