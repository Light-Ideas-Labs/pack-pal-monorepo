"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubmissionStatus = exports.getPendingSubmissions = exports.getAllSubmissions = exports.submitProject = void 0;
const model_1 = __importDefault(require("../models/submissions/model"));
const submitProject = async (data) => {
    try {
        return await model_1.default.create(data);
    }
    catch (error) {
        throw error;
    }
};
exports.submitProject = submitProject;
const getAllSubmissions = async (filterStatus) => {
    try {
        if (filterStatus) {
            return await model_1.default.find({ status: filterStatus });
        }
        return await model_1.default.find();
    }
    catch (error) {
        throw error;
    }
};
exports.getAllSubmissions = getAllSubmissions;
const getPendingSubmissions = async () => {
    try {
        return await model_1.default.find({ status: 'pending' });
    }
    catch (error) {
        throw error;
    }
};
exports.getPendingSubmissions = getPendingSubmissions;
const updateSubmissionStatus = async (submissionId, status, notes) => {
    try {
        return await model_1.default.findByIdAndUpdate(submissionId, { status, adminNotes: notes }, { new: true });
    }
    catch (error) {
        throw error;
    }
};
exports.updateSubmissionStatus = updateSubmissionStatus;
