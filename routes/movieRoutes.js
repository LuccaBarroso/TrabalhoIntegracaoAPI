import express from "express";
import * as movieController from "../controllers/movieController.js";

const router = express.Router();

// get all movies
router.get("/", movieController.getAll);
router.get("/top-ten", movieController.getTopTen);
router.get("/grouped-by-category", movieController.getGroupedByCategory);
router.get("/:id_movie", movieController.getById);

export default router;
