import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse, UploadApiOptions } from 'cloudinary';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { Request, Response } from 'express';

dotenv.config();

// ─── Cloudinary Config ─────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
  timeout: 60000, // 60 seconds
});

// ─── Upload with Retry ─────────────────────────────────────────────
const uploadWithRetry = async (
  filePath: string,
  options: UploadApiOptions,
  retries = 3
): Promise<UploadApiResponse> => {
  for (let i = 0; i < retries; i++) {
    try {
      const result = await cloudinary.uploader.upload(filePath, options);
      return result;
    } catch (error) {
      if (i < retries - 1) {
        console.log(`Retrying upload... (${i + 1})`);
      } else {
        throw error;
      }
    }
  }
  throw new Error('Upload failed after retries.');
};

// ─── Remove Tmp File ──────────────────────────────────────────────
const removeTmp = (path: string): void => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

// ─── File Upload Helper ───────────────────────────────────────────
const fileUploadHelper = {
  uploadAvatar: async (req: Request, res: Response): Promise<void> => {
    try {
      const imageFile = (req.files as any).file;
      cloudinary.uploader.upload(
        imageFile.tempFilePath,
        { folder: 'avatars', width: 150, height: 150, crop: 'fill' },
        async (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (err || !result) throw err;
          removeTmp(imageFile.tempFilePath);
          res.json({ url: result.secure_url });
        }
      );
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  },

  uploadPortfolio: async (req: Request, res: Response): Promise<void> => {
    try {
      const imageFile = (req.files as any).file;
      cloudinary.uploader.upload(
        imageFile.tempFilePath,
        { folder: 'portfolio', width: 150, height: 150, crop: 'fill' },
        async (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (err || !result) throw err;
          removeTmp(imageFile.tempFilePath);
          res.json({ url: result.secure_url });
        }
      );
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  },

  uploadPortfolioVideo: async (req: Request, res: Response): Promise<void> => {
    try {
      const videoFile = (req.files as any).file;
      cloudinary.uploader.upload(
        videoFile.tempFilePath,
        { folder: 'portfolioVideos', resource_type: 'video' },
        async (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (err || !result) throw err;
          removeTmp(videoFile.tempFilePath);
          res.json({ url: result.secure_url });
        }
      );
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  },

  uploadPdf: async (req: Request, res: Response): Promise<void> => {
    try {
      const pdfFile = (req.files as any).file;
      cloudinary.uploader.upload(
        pdfFile.tempFilePath,
        { folder: 'pdf', resource_type: 'auto' },
        async (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (err || !result) throw err;
          removeTmp(pdfFile.tempFilePath);
          res.json({ url: result.secure_url });
        }
      );
    } catch (err: any) {
      res.status(500).json({ err: err.message });
    }
  },
};

// ─── Export ───────────────────────────────────────────────────────
export { cloudinary, fileUploadHelper, uploadWithRetry };
