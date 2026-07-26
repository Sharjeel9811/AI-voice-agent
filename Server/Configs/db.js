import mongoose from 'mongoose';

let dbConnected = false;

export const ConnectDB=async()=>{
    try {
       await mongoose.connect(process.env.MONGODB_URL);
       dbConnected = true;
       console.log("DB connected successfully");
    } catch (error) {
        console.log("DB connection failed (will retry):", error.message);
    }
}

setInterval(() => {
    if (!dbConnected) {
        ConnectDB().catch(() => {});
    }
}, 30000);

export const isDbConnected = () => dbConnected;