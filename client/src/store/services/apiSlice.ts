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

    // Endpoint for getting all products/projects
    getAllProducts: builder.query<any, void>({
      query: () => '/get-all-project',  // Using the route '/get-all-project'
    }),
    getAllTask: builder.query<any, void>({
      query: () => '/tasks',  // Using the route '/get-all-project'
    }),


    // Endpoint for user registration
    registerUser: builder.mutation<any, { email: string; password: string; username: string }>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // Endpoint for user login
    loginUser: builder.mutation<any, { email: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    // New mutation for creating a task
    createTask: builder.mutation<any, {
      taskName: string;
      priority: string;
      taskStartDate: string;
      taskEndDate: string;
      taskStatus: string;
      assignee: string;
      project: string; // Optional
      module: string; // Optional
    }>({
      query: (taskData) => ({
        url: '/task',  // Assuming this is the endpoint for creating a task
        method: 'POST',
        body: taskData,
      }),
    }),

    deleteTask: builder.mutation<any, string>({
        query: (taskId) => ({
          url: `/task/${taskId}`, // Assuming '/task/:id' is the delete route
          method: 'POST',
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
    }>( {
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
  useCreateTaskMutation, // Export the new hook
  useGetAllProductsQuery,
  useGetAllUserDetailsQuery,
  useGetAllTaskQuery,
  useDeleteTaskMutation
} = apiSlice;
