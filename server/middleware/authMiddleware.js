import jwt from "jsonwebtoken";
import { getAuth } from "@clerk/express";
import Company from "../models/Company.js";
import User from "../models/User.js";

// -------------------- Company Middleware --------------------
export const protectCompany = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, login again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.company = await Company.findById(decoded.id).select("-password");

    if (!req.company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    next();
  } catch (error) {
    console.error("protectCompany error:", error.message);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// -------------------- User Middleware (Clerk) --------------------
export const protectUser = async (req, res, next) => {
  try {
    const { userId } = getAuth(req); // Clerk extracts from Bearer token

    if (!userId) {
      return res.status(401).json({ success: false, message: "Not authorized, login again" });
    }

    // find user in DB by Clerk's ID
    const user = await User.findOne({ clerkId: userId }).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found in DB" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("protectUser error:", error.message);
    res.status(401).json({ success: false, message: "Unauthorized" });
  }
};
