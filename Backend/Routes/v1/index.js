import express from 'express';
import { Router } from 'express';
import authRoutes from './Auth.js';
import imageRouter from './image.js'; 
import contentRouter from './content.js';
const router = Router();

router.use('/auth', authRoutes);
router.use('/image' , imageRouter);
router.use('/content', contentRouter);



export default router;