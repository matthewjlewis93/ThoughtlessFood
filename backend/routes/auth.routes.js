import express from "express";
import { registerUser } from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post('/login', registerUser);


export default authRouter;