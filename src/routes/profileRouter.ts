import express from 'express';
import { prisma } from '../../prisma';
import bcrypt from 'bcrypt';

const router = express.Router();

router.post('/save', async (req,res) =>{
    const {profileImage,name,graduationYear,major,resume } = req.body
    try {
        await prisma.profile.create({data: {profileImage,name,graduationYear,major,resume}})
        return res.status(201).json({message: 'User Profile has been saved successfully'})
    } catch (error){
        console.error(error);
        return res.status(500).json({error: 'Internal Server Error'})
    }
    
})