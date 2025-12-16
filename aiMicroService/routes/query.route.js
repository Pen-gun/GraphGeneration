import { getUserQueries, deleteQuery, createQuery } from "../controllers/query.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { Router } from "express";

const router = Router();

router.route('/').post(verifyJWT, createQuery);
//secure routes
router.route('/').get(verifyJWT, getUserQueries);
router.route('/:id').delete(verifyJWT, deleteQuery);


export default router;