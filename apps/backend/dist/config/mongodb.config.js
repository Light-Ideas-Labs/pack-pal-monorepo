"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const envConfig_1 = require("./envConfig");
const dbUrl = envConfig_1.env.PRO_MONGO_URI;
const connectDB = async () => {
    const options = {
        socketTimeoutMS: 30000,
        maxPoolSize: 50,
        autoIndex: false, // Don't build indexes
        serverSelectionTimeoutMS: 20000, // Timeout after 20 seconds
    };
    try {
        await mongoose_1.default.connect(dbUrl, options);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(`Database connection error: ${error.message}`);
        }
        else {
            console.error(`An unexpected error occurred: ${String(error)}`);
        }
        setTimeout(connectDB, 5000);
    }
};
exports.default = connectDB;
