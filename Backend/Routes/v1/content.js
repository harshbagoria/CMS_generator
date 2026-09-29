import express from 'express';
import { Router } from 'express';
import {auth} from '../../Middleware/Auth.js';
import {generatecontent } from '../../Controller/rewrite.js';


const router = Router();

router.post("/generate",auth, generatecontent);


export default router;