import express from "express";
import { checkLogIn, logInUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/login', logInUser);
authRouter.get('/verify', checkLogIn);


export default authRouter;