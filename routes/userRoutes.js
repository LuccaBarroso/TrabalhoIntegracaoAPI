import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// get all movies
router.post("/", userController.createUser);

export default router;
