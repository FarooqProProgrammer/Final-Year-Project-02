import { StatusCodes } from 'http-status-codes'; // Import the status codes
import { Request, Response } from "express";
import prisma from "@/util/prisma";
import bcrypt from "bcryptjs";
import { AuthSchema } from "@/validation";
import { ValidatedRequest } from 'express-joi-validation';
import { AuthSchemaRequest } from '@/types';

class AuthController {
    // Helper function for sending responses
    private static sendResponse(
        res: Response,
        status: number,
        message: string,
        data: object | null = null
    ) {
        return res.status(status).json({
            message,
            data,
        });
    }

    // Register
    static AuthRegister = async (req: ValidatedRequest<AuthSchemaRequest>, res: Response) => {
        try {
            // Log incoming request body and file
            console.log("Incoming request:", req.body);
            console.log("Uploaded file:", req.file);

            const { email, name, password } = req.body;
            const file = req.file;

            // Validate the registration input data
            const { error } = AuthSchema.validate(req.body);
            if (error) {
                console.log("Validation failed:", error.details);
                return this.sendResponse(res, StatusCodes.BAD_REQUEST, error.details[0].message);
            }

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                console.log("User already exists:", existingUser);
                return this.sendResponse(res, StatusCodes.BAD_REQUEST, "Email is already taken.");
            }

            // Hash the password using bcrypt
            const hashedPassword = await bcrypt.hash(password, 10);

            // Prepare the user data
            const userData = {
                email,
                name,
                password: hashedPassword,
                image: file ? `/uploads/${file.filename}` : null, // If file uploaded, save the image URL
            };

            // Create the user in the database
            const newUser = await prisma.user.create({
                data: userData,
            });

            // Return success response with user data (excluding password)
            console.log("User created:", newUser);
            return this.sendResponse(res, StatusCodes.CREATED, "User registered successfully", {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                imageUrl: newUser.image,
            });
        } catch (error) {
            console.error("Error occurred:", error);
            return this.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
        }
    };

    // Auth Login
    static AuthLogin = async (req: ValidatedRequest<AuthSchemaRequest>, res: Response) => {
        try {
            const { email, password } = req.body;

            // Validate input data
            const { error } = AuthSchema.validate(req.body);
            if (error) {
                return this.sendResponse(res, StatusCodes.BAD_REQUEST, error.details[0].message);
            }

            // Check if user exists in the database
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return this.sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid email or password.");
            }

            // Compare the hashed password with the entered password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return this.sendResponse(res, StatusCodes.BAD_REQUEST, "Invalid email or password.");
            }

            // Create a session for the logged-in user
            req.session.userId = user.id;  // Store user ID in the session
            req.session.email = user.email;
            req.session.name = user.name;

            // Return success response (without password)
            return this.sendResponse(res, StatusCodes.OK, "Login successful", {
                id: user.id,
                email: user.email,
                name: user.name,
                imageUrl: user.image,
            });
        } catch (error) {
            return this.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "Internal Server Error");
        }
    };

    // Logout
    static AuthLogout = (req: Request, res: Response) => {
        req.session.destroy((err) => {
            if (err) {
                return this.sendResponse(res, StatusCodes.INTERNAL_SERVER_ERROR, "Could not log out.");
            }
            res.clearCookie("connect.sid"); // Clear the session cookie
            return this.sendResponse(res, StatusCodes.OK, "Logout successful.");
        });
    };

}

export default AuthController;

