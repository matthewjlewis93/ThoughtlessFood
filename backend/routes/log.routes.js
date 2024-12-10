import express from "express";
import { addNewLog, deleteLogItem, getAllLogs, getRangedLogs, updateLogItem } from "../controllers/log.controller.js";

const logRouter = express.Router();

logRouter.get('/all', getAllLogs);

logRouter.get('/', getRangedLogs); // date and range in URL query

logRouter.post('/', addNewLog);

logRouter.patch('/:id', updateLogItem);

logRouter.delete('/:id', deleteLogItem);

export default logRouter;