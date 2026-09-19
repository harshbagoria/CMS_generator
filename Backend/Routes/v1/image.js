import express from 'express';
import { Router } from 'express';
import {generateImage} from '../../Controller/image.js';
//import {auth} from '../../Middleware/auth.js';
import {auth} from '../../Middleware/Auth.js';


const router = Router();

router.post("/generate",auth, generateImage);


export default router;