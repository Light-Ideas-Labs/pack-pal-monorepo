import { Request, Response } from 'express';
declare const submitProject: (req: Request, res: Response) => Promise<void>;
declare const getPendingSubmissions: (_req: Request, res: Response) => Promise<void>;
declare const reviewSubmission: (req: Request, res: Response) => Promise<void>;
export { submitProject, getPendingSubmissions, reviewSubmission };
