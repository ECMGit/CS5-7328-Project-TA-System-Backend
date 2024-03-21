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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController = __importStar(require("./user.controller"));
// import { authenticate } from 'middleware/authentication';
const router = (0, express_1.Router)();
router.get('/detail/:id', UserController.getUserDetailById);
router.get('/:id', UserController.getUserById);
router.get('/', UserController.getUsers); // route is not protected by authentication middleware
router.get('/role/:id', UserController.getRole);
// route is protected by authentication middleware
// router.get('/detail', authenticate, UserController.getUserDetailById); 
// ... other user-related routes
router.post('/signUp', UserController.signUp);
router.post('/login', UserController.login);
// reset password functionality
router.post('/password-reset-link', UserController.sendPasswordResetLink);
router.post('/password-reset/confirm', UserController.confirmResetPassword);
// testing purpose
router.post('/import', UserController.importUsers);
exports.default = router;
