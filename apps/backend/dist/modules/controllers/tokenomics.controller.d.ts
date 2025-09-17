import { Request, Response } from 'express';
declare const getTokenomics: (req: Request, res: Response) => Promise<void>;
declare const upsertTokenomics: (req: Request, res: Response) => Promise<void>;
export { getTokenomics, upsertTokenomics };
