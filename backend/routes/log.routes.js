import express from "express";
import {
  addNewLog,
  deleteLogItem,
  getAllLogs,
  getRangedLogs,
  updateLogItem,
} from "../controllers/log.controller.js";
import { userInfo } from "../config/userInfoMiddleware.js";

const logRouter = express.Router();
logRouter.use(userInfo);

logRouter.get("/all", getAllLogs);

logRouter.get("/", getRangedLogs); // date and range in URL query

logRouter.post("/", addNewLog);

logRouter.patch("/:id", updateLogItem);

logRouter.delete("/:id", deleteLogItem);

export default logRouter;
