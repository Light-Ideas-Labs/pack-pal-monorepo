"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const listing_controller_1 = require("../../modules/controllers/listing.controller");
const router = express_1.default.Router();
/**
 * @openapi
 * /api/v1/listings/all-listings:
 *   get:
 *     tags:
 *       - Listings
 *     summary: Get all recent listings
 *     responses:
 *       200:
 *         description: Listings retrieved
 */
router.get('/all-listings', listing_controller_1.getRecentListings);
/**
 * @openapi
 * /api/v1/listings/create:
 *   post:
 *     tags:
 *       - Listings
 *     summary: Create a new listing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               projectId:
 *                 type: string
 *               listingDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Listing created
 */
router.post('/create', listing_controller_1.createListing);
exports.default = router;
