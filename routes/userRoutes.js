import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// get all movies
router.post("/", userController.createUser);
router.get("/:device_id", userController.getByDeviceId);


export default router;
