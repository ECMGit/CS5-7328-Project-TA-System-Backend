import { Router } from "express";
import * as UserController from "./user.controller";
// import { authenticate } from 'middleware/authentication'; // add extra middleware here if you need to protect any route

// Bridge Pattern!

const router = Router();

router.get("/detail/:id", UserController.getUserDetailById);
router.get("/:id", UserController.getUserById);
router.get("/", UserController.getUsers); // route is not protected by authentication middleware
router.get("/role/:id", UserController.getRole);

// route is protected by authentication middleware
// router.get('/detail', authenticate, UserController.getUserDetailById);
// ... other user-related routes

router.post("/signUp", UserController.signUp);
router.post("/login", UserController.login);

// reset password functionality
router.post("/password-reset-link", UserController.sendPasswordResetLink);
router.post("/password-reset/confirm", UserController.confirmResetPassword);

// admin user only routes
router.get("/admin/students", UserController.getAllStudent);
router.get("/admin/course", UserController.getAllCourse);
router.get("/admin/faculty", UserController.getAllFaculty);
router.get("/admin/course/:id", UserController.getCourseDetailsByCourseId);

// testing purpose
router.post("/import", UserController.importUsers);

export default router;
