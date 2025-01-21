import express from "express";
import { checkLogIn, logInUser, logOut, registerUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/login', logInUser);
authRouter.post('/register', registerUser);
authRouter.get('/verify', checkLogIn);
authRouter.post('/logout', logOut);


export default authRouter;