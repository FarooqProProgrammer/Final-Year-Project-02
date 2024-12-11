import UserModal from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

// Register user
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, roles } = req.body;

    const userExists = await UserModal.findOne({ email:email });

    console.log(userExists)
    if (userExists) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "User already exists" });
    }

    if (!password) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "Password is required" });
    }

    let avatarUrl = "";
    if (req.file) {
        avatarUrl = `/uploads/avatars/${req.file.filename}`;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModal({
        username,
        email,
        password: hashedPassword,
        roles: roles || ['user'],
        avatar: avatarUrl,
    });

    await newUser.save();

    const userWithoutPassword = newUser.toObject();
    delete userWithoutPassword.password;

    res.status(StatusCodes.CREATED).json({
        message: "User registered successfully",
        user: userWithoutPassword,
    });
});

// Login user and get a token
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

  

    const normalizedEmail = email.trim().toLowerCase();
    const user = await UserModal.findOne({ email: normalizedEmail });

    console.log(user)

    if (!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    console.log(password)
    console.log(user.password)

    if (!isMatch) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || 'JWT_SECRET',
        { expiresIn: '1h' }
    );

    req.session.user = {
        id: user._id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        avatar: user.avatar,
    };

    res.json({
        message: "Login successful",
        token,
        user: {
            username: user.username,
            email: user.email,
            roles: user.roles,
            avatar: user.avatar,
        },
    });
});

// Get the authenticated user details
const getUserDetails = asyncHandler(async (req, res) => {
    const user = req.user;

    res.json({
        username: user.username,
        email: user.email,
        roles: user.roles,
        isAdmin: user.isAdmin,
    });
});

// Get all user details
const getAllUserDetails = asyncHandler(async (req, res) => {
    const users = await UserModal.find();

    const usersWithoutPassword = users.map(user => {
        const userObj = user.toObject();
        delete userObj.password;
        return userObj;
    });

    res.status(StatusCodes.OK).json({ users: usersWithoutPassword });
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Error while logging out" });
        }
        res.json({ message: "Logged out successfully" });
    });
});

export { registerUser, loginUser, getUserDetails, getAllUserDetails, logoutUser };
