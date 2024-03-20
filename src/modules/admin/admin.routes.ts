import { Router } from "express";
import * as adminbController from "./admin.controller";

const router = Router();
router.get('/students', adminbController.getAllStudent);

router.get("/course", adminbController.getAllCourse);

router.get("/faculty", adminbController.getAllFaculty);

export default router;
