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

        // Ensure password is provided before hashing
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Generate salt for bcrypt (you can change the salt rounds, 10 is a good default)
        const salt = await bcrypt.genSalt(10);
        // Hash the password with the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new UserModal({
            username,
            email,
            password: hashedPassword,
            roles: roles || ['user'], // Default to 'user' role if not provided
        });

        await newUser.save();

        // Return the user without password (using toObject() to remove password)
        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        res.status(201).json({ message: "User registered successfully", user: userWithoutPassword });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};




// Login user and get a token
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    console.log(req.body);

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
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'JWT_SECRET', { expiresIn: '1h' });

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


const logoutUser = (req, res) => {
    try {
        // Invalidate the token on the client-side, if needed
        // You can't invalidate JWTs server-side unless you maintain a blacklist
        res.json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export { registerUser, loginUser, getUserDetails };
