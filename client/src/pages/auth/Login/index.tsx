import React from "react";
import Helmet from "react-helmet";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from "../../../lib/axiosConfig"; // Make sure this is pointing to the correct axios instance
import { useNavigate } from 'react-router-dom';
import { useToast } from "../../../hooks/use-toast";
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

// Define TypeScript types for form data
interface IFormInputs {
    email: string;
    password: string;
}

interface LoginResponse {
    message: string;
    token: string;
    user: {
        username: string;
        email: string;
        roles: string[];
    };
}

// Validation schema with Yup
const schema = yup.object().shape({
    email: yup.string().email("Invalid email format").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Login: React.FC = () => {
    const navigate = useNavigate();
    const { toast } = useToast();

    // React Hook Form setup
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInputs>({
        resolver: yupResolver(schema),
    });

    // React Query mutation for login
    const mutation = useMutation<LoginResponse, Error, IFormInputs>({
        mutationFn: async (formData: IFormInputs) => {
            const response = await axiosInstance.post('/auth/login', formData);
            return response.data;
        },
        onError: (error) => {
            console.error("Error during login:", error);
            toast({
                title: "Error",
                description: "Invalid login credentials",
            });
        },
        onSuccess: (data) => {
            console.log("Login successful!");

            // Store token in cookies
            Cookies.set('authToken', data.token, { expires: 7 }); // Token will expire in 7 days

            // Store user info if needed (optional)
            Cookies.set('user', JSON.stringify(data.user), { expires: 7 });

            toast({
                title: "Success",
                description: "Login successful! Redirecting to your dashboard.",
            });

            // Redirect to the dashboard after a short delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500); // Delay for 1.5 seconds
        }
    });

    // Handle form submission
    const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
        mutation.mutate(data);
    };

    return (
        <>
            <Helmet>
                <title>Login</title>
            </Helmet>

            <div className="w-full min-h-screen bg-gray-200 flex justify-center items-center">
                <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Login</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-600 font-medium mb-2">Email Address</label>
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
                            <label htmlFor="password" className="block text-gray-600 font-medium mb-2">Password</label>
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
                                {mutation.isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <a href="/register" className="text-blue-500 hover:text-blue-700">Register here</a>
                        </p>
                    </div>

                    {mutation.isError && <p className="text-red-600 mt-4">{mutation.error instanceof Error ? mutation.error.message : 'An error occurred'}</p>}
                </div>
            </div>
        </>
    );
};

export default Login;
