import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();  //  create a new Router entity
const prisma = new PrismaClient();

router.post('/ta-evaluation', async (req: Request, res: Response) => {
    console.log("Received request for TA evaluation"); // try
    try {
        // get data from req.body
        const { taUserId, facultyUserId, courseId, teachingSkill, mentoringSkill, effectiveCommunication, comments } = req.body;

        // use Prisma created the database TAEvaluation
        const newEvaluation = await prisma.tAEvaluation.create({
            data: {
                taUserId,
                facultyUserId,
                courseId,
                teachingSkill,
                mentoringSkill,
                effectiveCommunication,
                comments
            }
        });

        res.status(201).json(newEvaluation);
    } catch (error: any) {
        // catch and solute the mistake
        res.status(500).json({ message: error.message });
    }
});

export default router;
