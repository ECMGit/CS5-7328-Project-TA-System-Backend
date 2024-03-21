"use strict";
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
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
//get all Ta jobs
const getAllTAJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    //using Prisma's findMany() method to retrieve all TA jobs from the database.
    return yield prisma.tAJob.findMany({
        include: {
            course: true,
            faculty: true,
        },
    });
});
exports.getAllTAJobs = getAllTAJobs;
//find TA Job by job id
const getTAJobById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //using Prisma's findMany() method to retrieve all TA jobs from the database.
    try {
        return yield prisma.tAJob.findUnique({
            where: { id },
            include: {
                course: true,
                faculty: true,
            },
        });
    }
    catch (err) {
        return null;
    }
});
exports.getTAJobById = getTAJobById;
const getTAJobsWithFilters = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // TODO: above'any' could be replaced with more specific types based on your conditions
        // 'any' could be replaced with more specific types based on your conditions
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const queryConditions = {};
        for (const [key, value] of Object.entries(filters)) {
            if (value) {
                // Check if the value is one of the properties that need to be converted to a number
                if ((key === 'courseId' || key === 'totalHoursPerWeek') &&
                    typeof value === 'string') {
                    const number = parseInt(value, 10);
                    // Check if the conversion was successful before adding to queryConditions
                    if (!isNaN(number)) {
                        queryConditions[key] = number;
                    }
                    else {
                        // If the conversion results in NaN and you prefer to not include it in the query,
                        // you can decide either to skip this condition or handle it appropriately, maybe by logging an error.
                        console.error(`Invalid number received for ${key}`);
                        // You can continue to the next iteration if you don't want this property to be part of your query
                        continue;
                    }
                }
                else {
                    // For other values, no conversion is needed
                    queryConditions[key] = value;
                }
            }
        }
        console.log('Query conditions:', queryConditions);
        // Now 'queryConditions' will have the right types for the values
        const jobs = yield prisma.tAJob.findMany({
            where: queryConditions,
            include: {
                course: true,
                faculty: {
                    include: {
                        user: true, // Include the user associated with the faculty
                    },
                },
            },
        });
        return jobs;
    }
    catch (error) {
        console.error('Error querying TA jobs with filters:', error);
        throw error;
    }
});
exports.getTAJobsWithFilters = getTAJobsWithFilters;
const getTAJobsByFacultyId = (facultyId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.tAJob.findMany({ where: { facultyId } });
});
exports.getTAJobsByFacultyId = getTAJobsByFacultyId;
/**
 * @param jobData Job data to be stored
 * @returns The job that was created
 * @throws Error if job could not be created
 */
const createJob = (jobData) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(jobData);
    try {
        return yield prisma.tAJob.create({
            data: jobData,
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.createJob = createJob;
//udpate job by id passed as param
/**
 * @param id id of the job to be updated
 * @param jobData data to be updated
 * @returns the job that was updated
 * @throws Error if job could not be updated
 */
const updateJob = (id, jobData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // update one job from database
        return yield prisma.tAJob.update({
            where: {
                id: id
            },
            //update partial data from body request
            data: jobData
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.updateJob = updateJob;
