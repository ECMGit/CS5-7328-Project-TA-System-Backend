import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { prisma } from '../../prisma';
import bcrypt from 'bcrypt';

const router = express.Router();

// Handle the request for sending a password reset link
router.post('/password-reset-link', async (req, res) => {
  const { email } = req.body;
  console.log(email);

  // 1. Verify if the email is in the database
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  // If the email is not found in the database, return an error response
  if (!user) {
    return res.status(400).send('Email not found');
  }

  // Generate a unique token and create a reset link
  const timestamp = Date.now();
  const currentDate = new Date(timestamp);
  const token = crypto.randomBytes(20).toString('hex');
  const resetLink = process.env.FRONTEND_URL + `resetPassword/${token}`;

  // Save the token and its expiry time to the database
  await prisma.user.update({
    where: {
      email: user.email
    },
    data: {
      resetToken: token,
      resetTokenExpiry: Date.now() + 3600000 // 1-hour expiry
    }
  });

  // Create a transporter object for sending emails
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Compose the email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `Click this link to reset your password: ${resetLink}`
  };

  try {
    // Send the reset email and respond with a success message
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Reset email sent' });
  } catch (error) {
    // If there's an error sending the email, return an error response
    console.error(error);
    res.status(500).send('Error sending email');
  }
});

// Handle the request for confirming and updating a password reset
router.post('/password-reset/confirm', async (req, res) => {
  const { token, password } = req.body;

  // 1. Find the user with the provided token
  const user = await prisma.user.findUnique({
    where: {
      resetToken: token
    }
  });

  // If the user with the token is not found, return an error response
  if (!user) {
    return res.status(400).send('Invalid token');
  }

  // 2. Check if the token has expired
  if (user.resetTokenExpiry && Date.now() > user.resetTokenExpiry) {
    return res.status(400).send('Token expired');
  }

  // 3. Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Update the user's password and clear the reset token
  await prisma.user.update({
    where: { email: user.email },
    data: {
      password: hashedPassword,
      resetToken: token,
      resetTokenExpiry: null
    }
  });

  // 5. Send a success response
  res.send({ message: 'Password updated successfully' });
});

export default router;
