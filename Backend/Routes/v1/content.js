import express from 'express';
import { Router } from 'express';
import {auth} from '../../Middleware/Auth.js';
import {generatecontent, Getcontenthistory } from '../../Controller/rewrite.js';


const router = Router();

router.post("/generate",auth, generatecontent);
router.get("/history", auth, Getcontenthistory);


export default router;