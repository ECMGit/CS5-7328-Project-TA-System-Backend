import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { prisma } from '../../prisma';
import bcrypt from 'bcrypt';
const router = express.Router();

router.post('/password-reset-link', async (req, res) => {

  const { email } = req.body;
  console.log(email);
  // 1. Verify if email is in database
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!user) {
    return res.status(400).send('Email not found');
  }

  const timestamp = Date.now();
  const currentDate = new Date(timestamp);

  const token = crypto.randomBytes(20).toString('hex');

  const resetLink = process.env.FRONTEND_URL + `resetPassword/${token}`;

  // Save token to database
  await prisma.user.update({
    where: {
      email: user.email
    },
    data: {
      resetToken: token,
      resetTokenExpiry: Date.now() + 3600000 // 1 hour expiry
    }
  });

  console.log(process.env.EMAIL_USER);
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `Click this link to reset your password: ${resetLink}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error sending email');
  }

});

router.post('/password-reset/confirm', async (req, res) => {

  const { token, password } = req.body;

  // 1. Find user by token
  const user = await prisma.user.findUnique({
    where: {
      resetToken: token
    }
  });

  if (!user) {
    return res.status(400).send('Invalid token');
  }

  // 2. Check if token expired
  if (user.resetTokenExpiry && Date.now() > user.resetTokenExpiry) {
    return res.status(400).send('Token expired');
  }

  // 3. Hash new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Update user password
  await prisma.user.update({
    where: { email: user.email },
    data: {
      password: hashedPassword,
      resetToken: token,
      resetTokenExpiry: null
    }
  });

  // 5. Send response
  res.send({ message: 'Password updated successfully' });

});

export default router;