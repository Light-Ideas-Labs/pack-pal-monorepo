import { Request, Response } from 'express';
declare const createProject: (req: Request, res: Response) => Promise<void>;
declare const getProjects: (_req: Request, res: Response) => Promise<void>;
declare const getProject: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
declare const updateProject: (req: Request, res: Response) => Promise<void>;
declare const deleteProject: (req: Request, res: Response) => Promise<void>;
export { getProjects, getProject, createProject, updateProject, deleteProject, };
