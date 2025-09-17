"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfMulter = exports.videoMulter = exports.imageMulter = void 0;
const multer_1 = __importDefault(require("multer"));
// Setup storage configurations
const ImageCoverfileStorage = multer_1.default.diskStorage({});
const ImagefileStorage = multer_1.default.diskStorage({});
const VideofileStorage = multer_1.default.diskStorage({});
const pdffileStorage = multer_1.default.diskStorage({});
// Define file filter functions with explicit types for request, file, and callback
const ImagefileFilter = (req, file, cb) => {
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tif', 'tiff'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (imageExtensions.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const VideofileFilter = (req, file, cb) => {
    const videoExtensions = ['mp4', 'mkv', 'mov', 'avi', 'wmv', 'flv', 'webm'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (videoExtensions.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
const pdffileFilter = (req, file, cb) => {
    const pdfExtensions = ['pdf'];
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    if (pdfExtensions.includes(fileExtension)) {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
// Multer instances for handling file uploads
const imageMulter = (0, multer_1.default)({ storage: ImagefileStorage, fileFilter: ImagefileFilter }).single('image');
exports.imageMulter = imageMulter;
const videoMulter = (0, multer_1.default)({ storage: VideofileStorage, fileFilter: VideofileFilter }).single('video');
exports.videoMulter = videoMulter;
const pdfMulter = (0, multer_1.default)({ storage: pdffileStorage, fileFilter: pdffileFilter }).single('portfolio_pdf');
exports.pdfMulter = pdfMulter;
