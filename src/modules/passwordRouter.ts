import express from 'express';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import {prisma} from '../../prisma';


const router = express.Router();

router.post('/password-reset-link', async (req, res) => {
  // const { email } = req.body;
  // todo: write your code here
  // 1. verify if email is in database
  const { email } = req.body; //, old_password, new_password } = req.body;
  const user = await prisma.user.findUnique({ where: { email }});

  if (!user) {
    return res.status(401).json({ error: 'Invalid email' });
  }
  
  const timestamp = Date.now();
  const currentDate = new Date(timestamp);

  console.log(email, currentDate.toLocaleString());

  const token = crypto.randomBytes(20).toString('hex');
  const resetLink = process.env.FRONTEND_URL + `/reset-password/${token}`;
  // Validate the email (make sure it's registered, etc.)

  // Create a reset token and expiry date for the user
  await prisma.user.update({
    where: { email: user.email },
    data: {
      resetToken: token,
      resetTokenExpiry: Date.now() + 3600000, // 1 hour from now
    },
  });

   // Alert the user if EMAIL_USER or EMAIL_PASS are not set
   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('ERROR: EMAIL_USER or EMAIL_PASS environment variables not set. Set it in .env\n');
  }

  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your preferred email service
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
    text: `Click the link below to reset your password:\n${resetLink}\nIf you did not request a password reset, please ignore this email.`
    // You'd typically generate a unique link for the user to reset their password
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send({ message: 'Reset email sent successfully.' });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ error: 'Failed to send reset email.' });
  }
});

router.get('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const user = await prisma.user.findUnique({ where: { resetToken: token} });
  if (!user) {
    return res.status(401).json({ error: 'Invalid/Expired Reset Token'});
  }
})


router.post('/password-reset/confirm', async (req, res) => {

  const { token, password } = req.body;
  // console.log(token, password);
  
  // 1. Find the user by the token
  const user = await prisma.user.findUnique( { where: { resetToken: token}});
  if (!user) {
    return res.status(401).json({error: 'User is null'});
  }

  // 2. Verify that the token hasn't expired (assuming you have an expiry date in your DB)
  // If you have a resetTokenExpiry field in your User model:
  if (!user.resetTokenExpiry || user.resetTokenExpiry < Date.now()) {
    return res.status(400).json({ error: 'The access token has expired'});
  }

  // 3. Hash the new password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Update the user's password in the database
  await prisma.user.update({
    where: {email: user.email},
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  });

  // 6. Send a response to the frontend
  res.status(200).json({message: 'Password reset successful'});

});


export default router;
