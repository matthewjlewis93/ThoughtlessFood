import express from "express";
import { checkLogIn, logInUser, registerUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/login', logInUser);
authRouter.post('/register', registerUser);
authRouter.get('/verify', checkLogIn);


export default authRouter;