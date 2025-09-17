"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isTokenExpired;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * Check if a JWT token is expired
 * @param {string} token - The JWT token to check
 * @returns {boolean} - Returns true if the token is expired, false otherwise
 */
function isTokenExpired(token) {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || typeof decoded.exp !== 'number') {
            return true; // If token can't be decoded or has no exp, treat as expired
        }
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    }
    catch (error) {
        return true; // On error, treat as expired
    }
}
