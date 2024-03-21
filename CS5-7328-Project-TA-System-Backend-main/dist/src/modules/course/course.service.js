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
exports.editCourse = exports.addCourses = exports.addCourse = exports.getOneCourse = exports.getAllCourses = void 0;
const prisma_1 = require("prisma");
const getAllCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.prisma.course.findMany();
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.getAllCourses = getAllCourses;
const getOneCourse = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.prisma.course.findUnique({
            where: {
                id: id,
            },
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.getOneCourse = getOneCourse;
/**
 * add course to database
 * @param courseData
 * @returns
 */
const addCourse = (course) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.prisma.course.create({
            data: course,
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.addCourse = addCourse;
/**
 * add batch of courses to database
 * @param courseDataList
 * @returns
 */
const addCourses = (courseDataList) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield prisma_1.prisma.course.createMany({
            data: courseDataList,
        });
    }
    catch (error) {
        console.log(error);
        throw error;
    }
});
exports.addCourses = addCourses;
// Add an edit function
const editCourse = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.course.update({
        where: { id },
        data: Object.assign({}, updateData),
    });
});
exports.editCourse = editCourse;
