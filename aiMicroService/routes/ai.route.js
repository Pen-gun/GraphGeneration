import {Router} from 'express';
import { generate } from '../ai/ai.controller.js';
import { generateGraphData } from '../ai/ollama.service.js';

const router = Router();

router.post('/generate', generate);
router.post('/generates', generateGraphData);
export default router;

