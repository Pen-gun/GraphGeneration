import { getUserQueries, deleteQuery, countQueries } from "../controllers/query.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router();

// Legacy endpoint removed - use POST /conversations/:id/messages instead
//secure routes
router.route('/').get(verifyJWT, getUserQueries);
router.route('/:id').delete(verifyJWT, deleteQuery);
router.route('/count').get(verifyJWT, countQueries);


export default router;