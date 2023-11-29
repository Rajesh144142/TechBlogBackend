import { Router } from "express";
import * as userController from '../Controllers/AuthController.js';
import * as postController from '../Controllers/PostController.js';
import {upload}from '../middlewares/multer.middleware.js'

const router = Router();

router.post('/auth/login', userController.login);
router.get('/profile', userController.profile);
router.post('/auth/signup', userController.signup);
router.delete('/auth/logout', userController.logout);
router.post('/create', upload.single('file'),postController.createPost);
router.get('/post',postController.getAllPost);
router.get('/post/:id',postController.getAPost)

export default router;