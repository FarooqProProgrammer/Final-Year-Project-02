import express from "express";
import { getUserDetails, loginUser, registerUser } from "../controller/auth-controller.js";
import authMiddleware from "../middleware/auth-middleware.js";


const authRouter = express.Router();

// Register route
authRouter.post("/register", registerUser);

// Login route
authRouter.post("/login", loginUser);

// Protected route to get user details (requires authentication)
authRouter.get("/profile", authMiddleware, getUserDetails);

export default authRouter;
