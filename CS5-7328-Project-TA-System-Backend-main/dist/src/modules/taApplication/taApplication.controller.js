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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaApplication = exports.updateTaApplication = exports.getTaApplicationByStudentId = exports.getTaApplications = exports.getTaApplication = exports.save = void 0;
const taApplicationService = __importStar(require("./taApplication.service"));
const fileUtils_1 = require("../../utils/fileUtils");
// import { prisma } from '../../../prisma';
/**
 * Save a TA application
 * @param req
 * @param res
 * @param next
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const save = (req, res, next) => {
    // Upload the resume file
    fileUtils_1.upload.single('resumeFile')(req, res, (err) => {
        if (err) {
            next(err);
            return;
        }
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const file = req.file;
                if (!file) {
                    return res.status(400).json({ message: 'No file uploaded' });
                }
                const applicationData = JSON.parse(req.body.data);
                const savedApplication = yield taApplicationService.saveApplication(applicationData, file);
                if (!savedApplication) {
                    return res.status(400).json({ message: 'Application already exists' });
                }
                res.status(201).json(savedApplication);
            }
            catch (error) {
                console.error(error);
                next(error);
            }
        }))();
    });
};
exports.save = save;
/**
 * get single ta application
 * @param req
 * @param res
 */
const getTaApplication = (req, res
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
) => __awaiter(void 0, void 0, void 0, function* () {
    const applicationId = Number(req.params.id);
    if (!applicationId) {
        return res.status(404).json({ message: 'Application not found' });
    }
    const application = yield taApplicationService.getApplication(applicationId);
    if (!application) {
        return res.status(404).json({ message: 'Application not found' });
    }
    return res.status(200).json(application);
});
exports.getTaApplication = getTaApplication;
/**
 * get a list of all applications
 * @param req
 * @param res
 * @param next
 */
const getTaApplications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // call the service layer function and pass req.query as the parameter
        const app = yield taApplicationService.getTaApplications();
        // send the response
        console.log(app);
        res.json(app);
    }
    catch (error) {
        next(error);
    }
});
exports.getTaApplications = getTaApplications;
/**
 * get a list of applications by student id
 * @param req
 * @param res
 * @param next
 */
const getTaApplicationByStudentId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const studentId = Number(req.params.studentId);
    try {
        // call the service layer function and pass req.query as the parameter
        const taApplications = yield taApplicationService.getTaApplicationsByStudentId(studentId);
        // send the response
        console.log(taApplications);
        res.json(taApplications);
    }
    catch (error) {
        next(error);
    }
});
exports.getTaApplicationByStudentId = getTaApplicationByStudentId;
/**
 * Update a TA application
 * @param req
 * @param res
 * @param next
 */
const updateTaApplication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const applicationId = Number(req.params.id);
    const updateData = req.body; // Add validation as needed
    // console.log('LMAO', updateData);
    // console.log('LMAO', applicationId);
    // console.log('LMAO', req.body);
    // console.log('LMAO', req.params);
    // console.log("LMAO", res);
    // console.log("LMAO", next);
    try {
        const updatedApplication = yield taApplicationService.updateApplication(applicationId, updateData);
        res.status(200).json(updatedApplication);
    }
    catch (error) {
        next(error);
    }
});
exports.updateTaApplication = updateTaApplication;
/**
 * Delete a TA application
 * @param req
 * @param res
 * @param next
 */
const deleteTaApplication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const applicationId = Number(req.params.id);
    try {
        yield taApplicationService.deleteApplication(applicationId);
        res.status(204).send(); // No Content
    }
    catch (error) {
        next(error);
    }
});
exports.deleteTaApplication = deleteTaApplication;
