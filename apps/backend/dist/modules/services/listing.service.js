"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentListings = exports.createListing = void 0;
const model_1 = __importDefault(require("../models/listing/model"));
const createListing = async (data) => {
    try {
        if (!data.projectId) {
            throw new Error("Project ID is required to create a listing");
        }
        return await model_1.default.create(data);
    }
    catch (error) {
        console.error("Error creating listing:", error);
        throw new Error("Failed to create listing");
    }
};
exports.createListing = createListing;
const getRecentListings = async () => {
    try {
        return await model_1.default.find().sort({ listedAt: -1 }).limit(25).populate('projectId');
    }
    catch (error) {
        console.error("Error fetching recent listings:", error);
        throw new Error("Failed to fetch recent listings");
    }
};
exports.getRecentListings = getRecentListings;
