import express from 'express';
import { prisma } from '../../prisma';
import bcrypt from 'bcrypt';

const router = express.Router();

// Register a new user
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if username is already taken
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({ data: { username, email, password } });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// User login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find thein user  the database
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Compare the provided password with the stored password
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    // Exclude password and other sensitive fields before sending
    const { password: _, ...safeUser } = user;
    return res.status(200).json({ message: 'Login successful', user: safeUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/import', async (req, res) => {
  const users = req.body;

  // Validate that the input is an array
  if (!Array.isArray(users)) {
    return res.status(400).json({ error: 'Input should be an array of users' });
  }

  // Validate each user object
  for (const user of users) {
    if (!user.username || !user.email || !user.password) {
      return res.status(400).json({ error: 'Each user object should have a username, email, and password' });
    }
  }

  try {
    // Batch create users
    const createdUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true, // This will skip any users with duplicate usernames or emails
    });

    return res.status(201).json({ message: `${createdUsers.count} users imported successfully` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


export default router;