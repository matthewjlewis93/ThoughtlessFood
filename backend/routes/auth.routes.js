import express from "express";
import { checkLogIn, createGuest, logInUser, logOut, registerUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/login', logInUser);
authRouter.post('/register', registerUser);
authRouter.get('/verify', checkLogIn);
authRouter.post('/logout', logOut);
authRouter.post('/guest', createGuest);


export default authRouter;