

import express from "express";
import {
  getUserData,
  applyForJob,
  getUserJobApplications,
  updateUserResume,
} from "../controllers/userController.js";

import { protectUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes (login required)
router.get("/profile", protectUser, getUserData);
router.post("/apply", protectUser, applyForJob);
router.get("/applications", protectUser, getUserJobApplications);
router.put("/resume", protectUser, updateUserResume);

export default router;
