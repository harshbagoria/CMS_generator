import express from 'express';
import { Router } from 'express';
import { image } from '../../Controller/image';
import {auth} from '../../Middleware/auth.js';


const router = Router();

router.post("/image", auth, image);


export default router;