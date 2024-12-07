import React from "react";
import Helmet from "react-helmet";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from "../../../lib/axiosConfig";
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "../../../hooks/use-toast"; // Ensure this is imported correctly

// Define TypeScript types for form data
interface IFormInputs {
    username: string;
    email: string;
    password: string;
}

interface RegisterResponse {
    message: string;
}

// Validation schema with Yup
const schema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Register: React.FC = () => {
    const navigate = useNavigate(); // Initialize navigate
    const { toast } = useToast(); // Access toast

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });

    // React Query mutation for registration
    const mutation = useMutation<RegisterResponse, Error, IFormInputs>({
        mutationFn: async (formData: IFormInputs) => {
            const response = await axiosInstance.post('/auth/register', formData); // Replace with your actual API endpoint
            return response.data;
        },
        onError: (error) => {
            console.error("Error during registration:", error);
        },
        onSuccess: () => {
            console.log("Registration successful!");

            // Show success toast
            toast({
                title: "Success",
                description: "Registration successful. Redirecting to login...",
            });

            // Redirect after a delay to allow toast display
            setTimeout(() => {
                navigate('/login');
            }, 1000); // Adjust the delay to match your needs
        }
    });

    // Handle form submission
    const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
        mutation.mutate(data);
    };

    return (
        <>
            <Helmet>
                <title>Register</title>
            </Helmet>

            <div className="w-full min-h-screen bg-gray-200 flex justify-center items-center">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Create Account</h2>

                    {/* Register Form */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-gray-600 font-medium mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                {...register("username")}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your username"
                            />
                            {errors.username && <p className="text-red-600 mt-1">{errors.username.message}</p>}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-600 font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                {...register("email")}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your email"
                            />
                            {errors.email && <p className="text-red-600 mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-gray-600 font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register("password")}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your password"
                            />
                            {errors.password && <p className="text-red-600 mt-1">{errors.password.message}</p>}
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition duration-200"
                                disabled={mutation.isLoading}
                            >
                                {mutation.isLoading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-500 hover:text-blue-700">
                                Login here
                            </Link>
                        </p>
                    </div>

                    {mutation.isError && <p className="text-red-600 mt-4">{mutation.error instanceof Error ? mutation.error.message : 'An error occurred'}</p>}
                </div>
            </div>
        </>
    );
};

export default Register;
