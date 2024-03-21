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
exports.updateJob = exports.createJob = exports.getTAJobsByFacultyId = exports.getTAJobsWithFilters = exports.getTAJobById = exports.getAllTAJobs = void 0;
const JobService = __importStar(require("./tajob.service"));
/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
//this get function returns all available TA jobs
const getAllTAJobs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('in get all');
    try {
        // return all jobs that have been published
        const taJobs = yield JobService.getAllTAJobs();
        if (taJobs.length == 0) {
            console.log('No job listings found.');
            // if there are no jobs found, return message that no jobs are found
            return res.status(404).json({ message: 'No job listings found.' });
        }
        res.json(taJobs);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getAllTAJobs = getAllTAJobs;
// this GET function searches for a TA job by job ID that the user passes in
const getTAJobById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // return jobs with matching job ID
        const taJob = yield JobService.getTAJobById(Number(req.params.id));
        if (!taJob) {
            // if no TA job is found with the required ID, return message indicating issue
            return res.status(404).json({ message: 'TA job not found' });
        }
        res.json(taJob);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getTAJobById = getTAJobById;
// New function to handle querying with filters.
const getTAJobsWithFilters = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('in controller');
    try {
        console.log(req.params);
        // Extract query parameters from the request. These will be your filters.
        const queryParams = req.query;
        // Call the service function, passing in the filters.
        const filteredTAJobs = yield JobService.getTAJobsWithFilters(queryParams);
        // Send back the filtered data.
        res.json(filteredTAJobs);
    }
    catch (error) {
        console.error('Error fetching TA jobs with filters:', error);
        next(error); // Pass errors to the next middleware.
    }
});
exports.getTAJobsWithFilters = getTAJobsWithFilters;
/**
 * get user by id
 * @param req
 * @param res
 * @param next
 * @returns
 */
//this function returns a list of jobs posted by the faculty member with the passed-in ID
const getTAJobsByFacultyId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // return jobs with matching faculty ID
        const taJobs = yield JobService.getTAJobsByFacultyId(Number(req.params.facultyId));
        // if (taJobs.length == 0) {
        //   //const user = await JobService.getTAJobsByFacultyId(Number(req.params.facultyId));
        //   //if (!user) {
        //   // if there are no jobs posted by the faculty member or if the faculty is not found, return this message
        //   return res.status(404).json({ message: 'No TA jobs found' });
        // }
        res.json(taJobs);
    }
    catch (error) {
        next(error);
    }
});
exports.getTAJobsByFacultyId = getTAJobsByFacultyId;
/**
 * @param req
 * @param res
 * @param next
 */
const createJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('in create ', req.body);
        const newJob = yield JobService.createJob(req.body);
        res.status(201).json(newJob);
    }
    catch (error) {
        next(error);
    }
});
exports.createJob = createJob;
//udpate job by id passed as param
/**
 * @param req
 * @param res
 * @param next
 */
const updateJob = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const job = yield JobService.updateJob(parseInt(req.params.id), req.body);
        res.json(job);
    }
    catch (error) {
        next(error);
    }
});
exports.updateJob = updateJob;
