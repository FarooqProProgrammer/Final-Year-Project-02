"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCreateTaskMutation, useGetAllProductsQuery, useGetAllUserDetailsQuery } from '@/store/services/apiSlice';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';

interface FormValues {
    taskName: string;
    priority: string;
    taskStartDate: string;
    taskEndDate: string;
    taskStatus: string;
    assignee: string; // User will be assigned through this field
    project: string; // Optional if task is linked to a project
    module?: string; // Optional if task is linked to a project
    taskDescription: string; // New task description field
    taskImage?: File; // Task image field
}

const CreateTask: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const { data: usersData } = useGetAllUserDetailsQuery();
    const { data } = useGetAllProductsQuery();

    const [createTask, { isLoading, isSuccess }] = useCreateTaskMutation();
    const router = useRouter();

    const [taskImage, setTaskImage] = useState<File | null>(null);

    useEffect(() => {
        console.log(usersData);
    }, [usersData]);

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        try {
            // Create a FormData object for the task creation request
            const payload = new FormData();
            payload.append("taskName", formData.taskName);
            payload.append("priority", formData.priority);
            payload.append("taskStartDate", formData.taskStartDate);
            payload.append("taskEndDate", formData.taskEndDate);
            payload.append("taskStatus", formData.taskStatus);
            payload.append("assignee", formData.assignee);
            payload.append("project", formData.project);
            payload.append("module", formData.module || "");
            payload.append("taskDescription", formData.taskDescription);

            if (taskImage) {
                payload.append("taskImage", taskImage); // Add the taskImage to FormData
            }

            const response = await createTask(payload).unwrap();
            console.log(response);

            if (isSuccess) {
                router.push("/task");
            }
        } catch (error) {
            console.error("Task creation failed", error);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setTaskImage(file);
        }
    };

    return (
        <div className="sm:px-20">
            <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-3">
                {/* Task Name */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Task Name</Label>
                    <Input
                        type="text"
                        placeholder="Enter Task Name"
                        {...register('taskName', { required: 'Task Name is required' })}
                    />
                    {errors.taskName && <p className="text-red-500 text-sm">{errors.taskName.message}</p>}
                </div>

                {/* Module */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Module</Label>
                    <Input
                        type="text"
                        placeholder="Enter Module"
                        {...register('module', { required: 'Module Name is required' })}
                    />
                    {errors.module && <p className="text-red-500 text-sm">{errors.module.message}</p>}
                </div>

                {/* Priority */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Priority</Label>
                    <Input
                        type="text"
                        placeholder="Enter Priority"
                        {...register('priority', { required: 'Priority is required' })}
                    />
                    {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
                </div>

                {/* Task Start Date */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Task Start Date</Label>
                    <Input
                        type="date"
                        {...register('taskStartDate', { required: 'Task Start Date is required' })}
                    />
                    {errors.taskStartDate && <p className="text-red-500 text-sm">{errors.taskStartDate.message}</p>}
                </div>

                {/* Task End Date */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Task End Date</Label>
                    <Input
                        type="date"
                        {...register('taskEndDate', { required: 'Task End Date is required' })}
                    />
                    {errors.taskEndDate && <p className="text-red-500 text-sm">{errors.taskEndDate.message}</p>}
                </div>

                {/* Task Status */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Task Status</Label>
                    <select
                        {...register('taskStatus', { required: 'Task Status is required' })}
                        className="input"
                    >
                        <option value="">Select Status</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                    {errors.taskStatus && <p className="text-red-500 text-sm">{errors.taskStatus.message}</p>}
                </div>

                {/* Assignee */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Assignee</Label>
                    <select
                        {...register('assignee', { required: 'Assignee is required' })}
                        className="input"
                    >
                        <option value="">Select Assignee</option>
                        {usersData?.users?.map((item) => (
                            <option key={item._id} value={item._id}>{item.username}</option>
                        ))}
                    </select>
                    {errors.assignee && <p className="text-red-500 text-sm">{errors.assignee.message}</p>}
                </div>

                {/* Project */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Project</Label>
                    <select {...register('project')} className="input">
                        <option value="">Select Project</option>
                        {data?.projects?.map((item) => (
                            <option key={item._id} value={item._id}>{item.projectTitle}</option>
                        ))}
                    </select>
                </div>

                {/* Task Description */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Task Description</Label>
                    <Textarea
                        {...register('taskDescription', { required: 'Task Description is required' })}
                        placeholder="Enter Task Description"
                        className="input"
                    />
                    {errors.taskDescription && <p className="text-red-500 text-sm">{errors.taskDescription.message}</p>}
                </div>

                {/* Task Image */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Task Image</Label>
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                </div>

                {/* Submit Button */}
                <div className="mt-2">
                    <Button type="submit" disabled={isLoading}>Submit</Button>
                </div>
            </form>
        </div>
    );
};

export default CreateTask;
