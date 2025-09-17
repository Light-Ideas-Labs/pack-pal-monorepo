import { Request, Response } from 'express';
declare const saveSnapshot: (req: Request, res: Response) => Promise<void>;
declare const getProjectHistory: (req: Request, res: Response) => Promise<void>;
export { saveSnapshot, getProjectHistory, };
