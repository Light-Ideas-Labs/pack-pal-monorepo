"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentListings = exports.createListing = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ListingService = __importStar(require("../services/listing.service"));
const createListing = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const created = await ListingService.createListing(req.body);
        res.status(201).json({
            message: 'Listing created successfully',
            data: created
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating listing', error });
    }
});
exports.createListing = createListing;
const getRecentListings = (0, express_async_handler_1.default)(async (_req, res) => {
    try {
        const listings = await ListingService.getRecentListings();
        res.status(200).json({
            message: 'Recent listings retrieved successfully',
            data: listings
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching recent listings', error });
    }
});
exports.getRecentListings = getRecentListings;
