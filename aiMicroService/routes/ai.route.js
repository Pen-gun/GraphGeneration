import {Router} from 'express';
import { generate } from '../ai/ai.controller.js';

const router = Router();

router.post('/generate', generate);

export default router;

