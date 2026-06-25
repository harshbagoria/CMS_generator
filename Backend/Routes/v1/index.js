import express from 'express';
import { Router } from 'express';
import authRoutes from './Auth.js';


const router = Router();

router.use('/auth', authRoutes);


export default router;