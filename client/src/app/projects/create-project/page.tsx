"use client";

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useCreateProjectMutation, useGetAllUserDetailsQuery, useGetUsersQuery } from '@/store/services/apiSlice';
import { useRouter } from 'next/navigation';

interface FormValues {
    projectTitle: string;
    severity: string;
    startDate: string;
    endDate: string;
    projectStatus: string;
    assignee: string;
    userId: string;
    projectImage: FileList;
}

const CreateProject: React.FC = () => {
    // Initialize React Hook Form
    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>();
    const [createProject, { isLoading, isSuccess, isError, error }] = useCreateProjectMutation();

    const { data: usersData } = useGetAllUserDetailsQuery()
    const router = useRouter()

    useEffect(() => {
        console.log(usersData)
    }, [usersData])



    // Handle form submission
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        console.log(data);




        const response = await createProject(data).unwrap();

        console.log(isSuccess)

        if (isSuccess) {
            router.push("/projects")
        }
    };

    return (
        <div className="sm:px-20">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
                {/* Project Name */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Project Name</Label>
                    <Input
                        type="text"
                        placeholder="Enter Project Name"
                        {...register('projectTitle', { required: 'Project Name is required' })}
                    />
                    {errors.projectTitle && <p className="text-red-500 text-sm">{errors.projectTitle.message}</p>}
                </div>

                {/* Severity */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Severity</Label>
                    <Input
                        type="text"
                        placeholder="Enter Severity"
                        {...register('severity', { required: 'Severity is required' })}
                    />
                    {errors.severity && <p className="text-red-500 text-sm">{errors.severity.message}</p>}
                </div>

                {/* Start Date */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Start Date</Label>
                    <Input
                        type="date"
                        {...register('startDate', { required: 'Start Date is required' })}
                    />
                    {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
                </div>

                {/* Project Image */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Project Image</Label>
                    <Input
                        type="file"
                        {...register('projectImage', { required: 'Project Image is required' })}
                    />
                    {errors.projectImage && <p className="text-red-500 text-sm">{errors.projectImage.message}</p>}
                </div>

                {/* End Date */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>End Date</Label>
                    <Input
                        type="date"
                        {...register('endDate', { required: 'End Date is required' })}
                    />
                    {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate.message}</p>}
                </div>

                {/* Project Status */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Project Status</Label>
                    <select
                        {...register('projectStatus', { required: 'Project Status is required' })}
                        className="input"
                    >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                    </select>
                    {errors.projectStatus && <p className="text-red-500 text-sm">{errors.projectStatus.message}</p>}
                </div>

                {/* Assignee */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>Assignee</Label>
                    <Input
                        type="text"
                        placeholder="Enter Assignee"
                        {...register('assignee', { required: 'Assignee is required' })}
                    />
                    {errors.assignee && <p className="text-red-500 text-sm">{errors.assignee.message}</p>}
                </div>

                {/* User ID */}
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label>User ID</Label>
                    {/* <Input
                        type="text"
                        placeholder="Enter User ID"
                        defaultValue={'6756a2cad5c4c919f6084abc'}
                        value={'6756a2cad5c4c919f6084abc'}
                        {...register('userId', { required: 'User ID is required' })}
                    /> */}
                    <select {...register('userId', { required: 'User ID is required' })} id="">
                        {
                            usersData?.users?.map((item, index) => {
                                return (
                                    <option value={item?._id}>{item?.username}</option>
                                )
                            })
                        }
                    </select>
                    {errors.userId && <p className="text-red-500 text-sm">{errors.userId.message}</p>}
                </div>

                {/* Submit Button */}
            </div>
            <div className='mt-4'>
                <Button type="submit" onClick={handleSubmit(onSubmit)}>Submit</Button>
            </div>
        </div>
    );
};

export default CreateProject;
