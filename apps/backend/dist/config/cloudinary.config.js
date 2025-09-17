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
exports.uploadWithRetry = exports.fileUploadHelper = exports.cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const dotenv = __importStar(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
dotenv.config();
// ─── Cloudinary Config ─────────────────────────────────────────────
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
    timeout: 60000, // 60 seconds
});
// ─── Upload with Retry ─────────────────────────────────────────────
const uploadWithRetry = async (filePath, options, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const result = await cloudinary_1.v2.uploader.upload(filePath, options);
            return result;
        }
        catch (error) {
            if (i < retries - 1) {
                console.log(`Retrying upload... (${i + 1})`);
            }
            else {
                throw error;
            }
        }
    }
    throw new Error('Upload failed after retries.');
};
exports.uploadWithRetry = uploadWithRetry;
// ─── Remove Tmp File ──────────────────────────────────────────────
const removeTmp = (path) => {
    fs_1.default.unlink(path, (err) => {
        if (err)
            throw err;
    });
};
// ─── File Upload Helper ───────────────────────────────────────────
const fileUploadHelper = {
    uploadAvatar: async (req, res) => {
        try {
            const imageFile = req.files.file;
            cloudinary_1.v2.uploader.upload(imageFile.tempFilePath, { folder: 'avatars', width: 150, height: 150, crop: 'fill' }, async (err, result) => {
                if (err || !result)
                    throw err;
                removeTmp(imageFile.tempFilePath);
                res.json({ url: result.secure_url });
            });
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    },
    uploadPortfolio: async (req, res) => {
        try {
            const imageFile = req.files.file;
            cloudinary_1.v2.uploader.upload(imageFile.tempFilePath, { folder: 'portfolio', width: 150, height: 150, crop: 'fill' }, async (err, result) => {
                if (err || !result)
                    throw err;
                removeTmp(imageFile.tempFilePath);
                res.json({ url: result.secure_url });
            });
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    },
    uploadPortfolioVideo: async (req, res) => {
        try {
            const videoFile = req.files.file;
            cloudinary_1.v2.uploader.upload(videoFile.tempFilePath, { folder: 'portfolioVideos', resource_type: 'video' }, async (err, result) => {
                if (err || !result)
                    throw err;
                removeTmp(videoFile.tempFilePath);
                res.json({ url: result.secure_url });
            });
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    },
    uploadPdf: async (req, res) => {
        try {
            const pdfFile = req.files.file;
            cloudinary_1.v2.uploader.upload(pdfFile.tempFilePath, { folder: 'pdf', resource_type: 'auto' }, async (err, result) => {
                if (err || !result)
                    throw err;
                removeTmp(pdfFile.tempFilePath);
                res.json({ url: result.secure_url });
            });
        }
        catch (err) {
            res.status(500).json({ err: err.message });
        }
    },
};
exports.fileUploadHelper = fileUploadHelper;
