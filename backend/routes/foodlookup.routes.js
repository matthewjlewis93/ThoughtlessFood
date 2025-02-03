import express from "express";
import foodLookup from "../controllers/foodlookup.controller.js";

const foodLookupRouter = express.Router();

foodLookupRouter.get("/:searchParam", foodLookup);

export default foodLookupRouter;
