import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// GET the result of Ta performance from database
router.get('/performance-results', async (req: Request, res: Response) => {
    try {
        const evaluations = await prisma.tAEvaluation.findMany({
            include: {
                taUser: {
                    select: { username: true }
                },
                facultyUser: {
                    select: { username: true }
                },
                course: {
                    select: { title: true }
                }
            }
        });

        res.json(evaluations);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error retrieving performance results' });
    }
});

export default router;
