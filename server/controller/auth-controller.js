import UserModal from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const registerUser = async (req, res) => {
    const { username, email, password, roles } = req.body;

    try {
        const userExists = await UserModal.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            roles: roles || ['user'], 
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Login user and get a token
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModal.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // Create JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: "Login successful",
            token,
            user: {
                username: user.username,
                email: user.email,
                roles: user.roles,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



// Get the authenticated user details
const getUserDetails = async (req, res) => {
    try {
        const user = req.user;
        res.json({
            username: user.username,
            email: user.email,
            roles: user.roles,
            isAdmin: user.isAdmin,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export { registerUser, loginUser, getUserDetails };
