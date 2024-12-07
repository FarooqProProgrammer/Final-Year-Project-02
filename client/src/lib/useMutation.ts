import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

// Define the input and response types
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  message: string;
}

// Define the mutation function with the correct return type
const registerUser = async (formData: RegisterFormData): Promise<RegisterResponse> => {
  const response = await axios.post('/api/register', formData);
  return response.data;
};

// Custom hook to use the mutation
export const useRegisterUser = () => {
  return useMutation<RegisterResponse, Error, RegisterFormData>(registerUser);
};
