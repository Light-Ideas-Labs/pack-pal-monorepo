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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getProjects = void 0;
const ProjectService = __importStar(require("../services/project.service"));
const createProject = async (req, res) => {
    const created = await ProjectService.createProject(req.body);
    res.status(201).json(created);
};
exports.createProject = createProject;
const getProjects = async (_req, res) => {
    const projects = await ProjectService.getAllProjects();
    res.json(projects);
};
exports.getProjects = getProjects;
const getProject = async (req, res) => {
    const { id } = req.params;
    const project = await ProjectService.getProjectById(id);
    if (!project)
        return res.status(404).json({ error: 'Project not found' });
    res.json(project);
};
exports.getProject = getProject;
const updateProject = async (req, res) => {
    const { id } = req.params;
    const updated = await ProjectService.updateProjectById(id, req.body);
    res.json(updated);
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    const { id } = req.params;
    await ProjectService.deleteProjectById(id);
    res.status(204).send();
};
exports.deleteProject = deleteProject;
