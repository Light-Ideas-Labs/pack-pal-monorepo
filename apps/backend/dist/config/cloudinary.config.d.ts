import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary';
import { Request, Response } from 'express';
declare const uploadWithRetry: (filePath: string, options: UploadApiOptions, retries?: number) => Promise<UploadApiResponse>;
declare const fileUploadHelper: {
    uploadAvatar: (req: Request, res: Response) => Promise<void>;
    uploadPortfolio: (req: Request, res: Response) => Promise<void>;
    uploadPortfolioVideo: (req: Request, res: Response) => Promise<void>;
    uploadPdf: (req: Request, res: Response) => Promise<void>;
};
export { cloudinary, fileUploadHelper, uploadWithRetry };
