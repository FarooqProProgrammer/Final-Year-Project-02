import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setLoading, setTasks } from '../slice/tasksSlice';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api' }),
    endpoints: (builder) => ({

        getUsers: builder.query<any, void>({
            query: () => 'users',
        }),

        getSeverity: builder.query<any, any>({
            query: () => ({
                url: "/severity"
            })
        }),


        getProjectCounts: builder.query<any, void>({
            query: () => ({
                url: '/get-project-counts',
            }),
        }),

        // New endpoint to fetch all user details
        getAllUserDetails: builder.query<any, void>({
            query: () => '/auth/get-all-users',  // Using the route '/auth/get-all-users'
        }),

        // Endpoint for getting all products/projects
        getAllProducts: builder.query<any, void>({
            query: () => '/get-all-project',  // Using the route '/get-all-project'
        }),

        getReport: builder.query<any, void>({
            query: () => ({
                url: '/get-report',
                responseType: 'blob', // Ensure the response is treated as a binary file
            }),
        }),

        getTotalCounts: builder.query<any, void>({
            query: () => ({
                url: "/total-counts"
            })
        }),

        getAllTask: builder.query<any, void>({
            query: () => '/tasks',
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    dispatch(setLoading(true)); // Set loading to true when query starts
                    const { data } = await queryFulfilled;
                    dispatch(setTasks(data)); // Store the fetched tasks in the tasksSlice
                } catch (err) {
                    console.error('Error fetching tasks:', err);
                } finally {
                    dispatch(setLoading(false)); // Set loading to false when query ends
                }
            },
        }),

        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/delete-project/${id}`,
                method: 'DELETE',
            }),
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
            project?: string; // Optional
            module?: string; // Optional
        }>({
            query: (taskData) => ({
                url: '/task',  // Assuming this is the endpoint for creating a task
                method: 'POST',
                body: taskData,
            }),
        }),

        updateTask: builder.mutation<any, {
            taskId: string;
            taskName: string;
            priority: string;
            taskStartDate: string;
            taskEndDate: string;
            taskStatus: string;
            assignee: string;
            project?: string; // Optional
            module?: string; // Optional
        }>({
            query: (taskData) => ({
                url: `/update-task/${taskData.taskId}`, // Assuming the route for updating a task is '/task/:taskId'
                method: 'PUT',  // Using PUT for updating the resource
                body: {
                    taskName: taskData.taskName,
                    priority: taskData.priority,
                    taskStartDate: taskData.taskStartDate,
                    taskEndDate: taskData.taskEndDate,
                    taskStatus: taskData.taskStatus,
                    assignee: taskData.assignee,
                    project: taskData.project,
                    module: taskData.module,
                },
            }),
        }),

        deleteTask: builder.mutation<any, string>({
            query: (taskId) => ({
                url: `/task/${taskId}`, // Assuming '/task/:id' is the delete route
                method: 'POST',
            }),
        }),
        createSeverity: builder.mutation<any, { severityName: string; }>({
            query: ({ severityName }) => ({
                url: '/create-severity', // This should match your route
                method: 'POST',
                body: {Severity:severityName},
            }),
        }),
        deleteSeverity: builder.mutation<any, string>({
            query: (severityId) => ({
                url: `/severity/${severityId}`, // Assuming '/task/:id' is the delete route
                method: 'DELETE',
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

        // New mutation to update a project
        updateProject: builder.mutation<any, {
            projectId: string;
            projectTitle: string;
            severity: string;
            startDate: string;
            endDate: string;
            projectStatus: string;
        }>({
            query: (projectData) => ({
                url: `/update-project/${projectData.projectId}`, // The update route with the projectId
                method: 'PUT',  // Using PUT for updating the project
                body: {
                    projectTitle: projectData.projectTitle,
                    severity: projectData.severity,
                    startDate: projectData.startDate,
                    endDate: projectData.endDate,
                    projectStatus: projectData.projectStatus,
                },
            }),
        }),

    }),
});

// Export hooks for usage in functional components
export const {
    useGetUsersQuery,
    useRegisterUserMutation,
    useLoginUserMutation,
    useGetSeverityQuery,
    useCreateSeverityMutation,
    useCreateProjectMutation,
    useDeleteSeverityMutation,
    useUpdateProjectMutation, // Export the new hook
    useCreateTaskMutation, // Export the create task hook
    useUpdateTaskMutation, // Export the update task hook
    useGetAllProductsQuery,
    useGetAllUserDetailsQuery,
    useGetAllTaskQuery,
    useDeleteTaskMutation,
    useDeleteProjectMutation,
    useLazyGetReportQuery,
    useGetTotalCountsQuery,
    useGetProjectCountsQuery
} = apiSlice;
