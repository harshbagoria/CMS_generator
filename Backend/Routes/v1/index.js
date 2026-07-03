import express from 'express';
import { Router } from 'express';
import authRoutes from './Auth.js';
import imageRouter from './image.js'; 

const router = Router();

router.use('/auth', authRoutes);
router.use('/image' , imageRouter);


export default router;