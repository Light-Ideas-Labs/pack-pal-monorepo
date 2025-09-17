"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProjectById = exports.updateProjectById = exports.getProjectById = exports.getAllProjects = exports.createProject = void 0;
const model_1 = __importDefault(require("../models/projects/model"));
const model_2 = __importDefault(require("../models/news/model"));
const model_3 = __importDefault(require("../models/tokenomics/model"));
const model_4 = __importDefault(require("../models/metrics/model"));
const createProject = async (data) => {
    const existing = await model_1.default.findOne({ slug: data.slug });
    if (existing)
        throw new Error('Project with this slug already exists');
    return await model_1.default.create(data);
};
exports.createProject = createProject;
const getAllProjects = async () => {
    return await model_1.default.find().sort({ createdAt: -1 });
};
exports.getAllProjects = getAllProjects;
const getProjectById = async (id) => {
    const project = await model_1.default.findById(id);
    if (!project)
        throw new Error('Project not found');
    return project;
};
exports.getProjectById = getProjectById;
const updateProjectById = async (id, data) => {
    const project = await model_1.default.findById(id);
    if (!project)
        throw new Error('Project not found');
    if (data.slug && data.slug !== project.slug) {
        const existing = await model_1.default.findOne({ slug: data.slug });
        if (existing)
            throw new Error('Slug already exists');
    }
    return await model_1.default.findByIdAndUpdate(id, data, { new: true });
};
exports.updateProjectById = updateProjectById;
const deleteProjectById = async (id) => {
    const project = await model_1.default.findById(id);
    if (!project)
        throw new Error('Project not found');
    const hasNews = await model_2.default.exists({ projectId: id });
    const hasMetrics = await model_4.default.exists({ projectId: id });
    const hasTokenomics = await model_3.default.exists({ projectId: id });
    if (hasNews || hasMetrics || hasTokenomics) {
        throw new Error('Cannot delete project with associated records');
    }
    return await model_1.default.findByIdAndDelete(id);
};
exports.deleteProjectById = deleteProjectById;
