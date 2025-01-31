import mongoose from "mongoose";

const uri = "mongodb+srv://srahul1357:ritika123@cve-cluster.xpk9g.mongodb.net/?retryWrites=true&w=majority&appName=cve-cluster"

const MONGO_URI = uri || "";

// Connect to the database
export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Failed", error);
    }
};
