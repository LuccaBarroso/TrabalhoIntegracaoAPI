import express from "express";
import * as reviewController from "../controllers/reviewController.js";

const router = express.Router();

// get all movies
router.post("/", reviewController.createReview);
router.get("/average/:id_movie", reviewController.getAverageByMovieId);
router.get("/:device_id/:id_movie", reviewController.getByMovieIdAndUserId);

export default router;
