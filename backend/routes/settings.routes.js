import { userInfo } from "../config/userInfoMiddleware.js";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import express from "express";

const settingsRouter = express.Router();
settingsRouter.use(userInfo);

settingsRouter.get("/", getSettings);

settingsRouter.patch("/", updateSettings);

export default settingsRouter;