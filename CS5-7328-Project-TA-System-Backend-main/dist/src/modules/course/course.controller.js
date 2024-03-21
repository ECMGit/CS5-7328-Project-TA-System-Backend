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
exports.getAllCourses = exports.editCourse = exports.addCourse = exports.getOneCourse = exports.importCoursesBatch = void 0;
const CourseService = __importStar(require("./course.service"));
/**
 * Middleware function to import courses in batch.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next middleware function
 */
const importCoursesBatch = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coursesBatch = req.body;
        const courses = yield CourseService.addCourses(coursesBatch);
        res.json(courses);
    }
    catch (error) {
        next(error);
    }
});
exports.importCoursesBatch = importCoursesBatch;
/**
 * Middleware function to handle getting a single course by ID.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next middleware function
 */
const getOneCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.id);
        const course = yield CourseService.getOneCourse(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.json(course);
    }
    catch (error) {
        next(error);
    }
});
exports.getOneCourse = getOneCourse;
/**
 * Middleware function to handle adding a new course.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next middleware function
 */
const addCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newCourseData = req.body;
        const newCourse = yield CourseService.addCourse(newCourseData);
        res.status(201).json(newCourse);
    }
    catch (error) {
        next(error);
    }
});
exports.addCourse = addCourse;
/**
 * Middleware function to handle updating a course.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next middleware function
 */
const editCourse = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courseId = parseInt(req.params.id);
        const newCourseData = req.body;
        const updatedCourse = yield CourseService.editCourse(courseId, newCourseData);
        res.json(updatedCourse);
    }
    catch (error) {
        next(error);
    }
});
exports.editCourse = editCourse;
/**
 * Middleware function to handle getting all courses.
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Next middleware function
 */
const getAllCourses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield CourseService.getAllCourses();
        res.json(courses);
    }
    catch (error) {
        next(error);
    }
});
exports.getAllCourses = getAllCourses;
