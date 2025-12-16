import { changePassword, getCurrentUser, loginUser, logOutUser, refreshAccessToken, registerUser, updateAccount } from '../controllers/user.controller.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import { Router} from 'express';

const router = Router();


router.route('/').post(registerUser);
router.route('/login').post(loginUser);

//secure routes
router.route('/logout').post(verifyJWT,logOutUser);
router.route('/profile').get(verifyJWT, getCurrentUser);
router.route('/change-password').post(verifyJWT, changePassword);
router.route('/refresh-token').post(refreshAccessToken);
router.route('/update-profile').patch(verifyJWT, updateAccount);



export default router;

