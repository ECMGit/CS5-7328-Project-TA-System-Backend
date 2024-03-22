import { Router } from 'express';
import { prisma } from 'prisma/index';

const feedbackRouter = Router();

// Route to create a new piece of feedback
feedbackRouter.post('/', (req, res) => {
  prisma.feedback
    .create({
      data: {
        content: req.body.content,
        complete: false,
        leftBy: {
          connect: {
            id: req.body.userId,
          },
        },
      },
    })
    .then((feedback) => {
      res.status(200).json(feedback);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Get all of the feedback to show to the student
feedbackRouter.get('/', async (req, res) => {
  return res.json(await prisma.feedback.findMany());
});

export { feedbackRouter };

