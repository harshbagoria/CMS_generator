import express from 'express';
import { Router } from 'express';
import {Signup} from '../../Controller/authController.js';
import {Login1} from '../../Controller/authController.js';


const router = Router();

router.post("/signup", Signup);
router.post("/login",Login1);

export default router;