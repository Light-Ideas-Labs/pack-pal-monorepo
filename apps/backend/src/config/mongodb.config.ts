import mongoose from 'mongoose';
import { env } from './envConfig'

const dbUrl = env.PRO_MONGO_URI;

const connectDB = async (): Promise<void> => {
    const options: mongoose.ConnectOptions = {
        socketTimeoutMS: 30000,
        maxPoolSize: 50,
        autoIndex: false, // Don't build indexes
        serverSelectionTimeoutMS: 20000, // Timeout after 20 seconds
    };

    try {
        await mongoose.connect(dbUrl, options);
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(`Database connection error: ${error.message}`);
        } else {
            console.error(`An unexpected error occurred: ${String(error)}`);
        }
        setTimeout(connectDB, 5000);
    }
}

export default connectDB;