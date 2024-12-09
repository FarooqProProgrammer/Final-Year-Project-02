import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api' }), // Ensure BASE_URL is defined in .env file
  endpoints: (builder) => ({
    // Existing endpoint to fetch users
    getUsers: builder.query<any, void>({
      query: () => 'users',
    }),

    // New endpoint to fetch all user details
    getAllUserDetails: builder.query<any, void>({
      query: () => '/auth/get-all-users',  // Using the route '/auth/get-all-users'
    }),

    // Endpoint for user registration
    registerUser: builder.mutation<any, { email: string; password: string; username: string }>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    getAllProducts: builder.query<any, void>({
        query: () => '/get-all-project',  // Using the route '/auth/get-all-users'
      }),
  

    // Endpoint for user login
    loginUser: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // Updated endpoint for creating a project with image upload and other fields
    createProject: builder.mutation<any, {
      projectTitle: string;
      severity: string;
      startDate: string;
      endDate: string;
      projectStatus: string;
      assignee: string;
      userId: string;
      projectImage: File;
    }>({
      query: (projectData) => {
        const formData = new FormData();
        formData.append('projectTitle', projectData.projectTitle);
        formData.append('severity', projectData.severity);
        formData.append('startDate', projectData.startDate);
        formData.append('endDate', projectData.endDate);
        formData.append('projectStatus', projectData.projectStatus);
        formData.append('assignee', projectData.assignee);
        formData.append('userId', projectData.userId);
        formData.append('projectImage', projectData.projectImage);

        return {
          url: '/create-project',
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const { 
  useGetUsersQuery, 
  useRegisterUserMutation, 
  useLoginUserMutation, 
  useCreateProjectMutation, 
  useGetAllProductsQuery,
  useGetAllUserDetailsQuery  // Export the new hook
} = apiSlice;
