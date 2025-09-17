"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedProjects = void 0;
const model_1 = __importDefault(require("../modules/models/projects/model"));
const agridex_seed_data_json_1 = __importDefault(require("./agridex_seed_data.json"));
const projectsDataRaw = agridex_seed_data_json_1.default.projects;
const seedProjects = async (logger) => {
    try {
        logger.info('Seeding projects');
        await model_1.default.deleteMany({});
        logger.info('Existing projects deleted');
        for (const project of projectsDataRaw) {
            logger.info(`Checking if project ${project.name} exists`);
            const existingProject = await model_1.default.findOne({ slug: project.slug });
            if (!existingProject) {
                const projectToSave = Object.assign(Object.assign({}, project), { listedAt: project.listedAt ? new Date(project.listedAt) : undefined });
                const newProject = new model_1.default(projectToSave);
                const savedItem = await newProject.save();
                logger.info(`Project ${savedItem.name} seeded successfully`);
            }
            else {
                logger.info(`Project ${project.name} already exists`);
            }
        }
        logger.info('Seeding Projects finished');
    }
    catch (error) {
        logger.error('Error seeding projects:', error);
    }
};
exports.seedProjects = seedProjects;
