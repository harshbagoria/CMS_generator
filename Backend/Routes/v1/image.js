import express from 'express';
import { Router } from 'express';
import {generateImage, generateImageHistory} from '../../Controller/image.js';
//import {auth} from '../../Middleware/auth.js';
import {auth} from '../../Middleware/Auth.js';


const router = Router();

router.post("/generate",auth, generateImage);
router.get("/history", auth, generateImageHistory);


export default router;