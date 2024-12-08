import React, { useState, useEffect } from 'react';
import { Input } from '../../../../components/ui/input';
import { Label } from '../../../../components/ui/label';
import { Helmet } from 'react-helmet';
import { DatePickerDemo } from '../../../../components/ui/DatePickerDemo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/ui/select';
import ReactQuill from 'react-quill';
import ImageUploader from 'react-image-upload';
import { useForm, SubmitHandler, FieldValues, SetValueConfig } from 'react-hook-form';
import { Button } from '../../../../components/ui/button';
import { useMutation } from '@tanstack/react-query';
import axiosInstance from '../../../../lib/axiosConfig';
import useGetUsers from '../../../../hooks/use-get-users';
import { toast } from '../../../../hooks/use-toast';


// Define the interface for the form input data
interface IFormInput {
  projectTitle: string;
  severity: string;
  startDate: string;
  endDate: string;
  projectStatus: string;
  assignee: string;
  projectImage: File | null;
}

// Mock API function to simulate form submission with Axios
const submitProject = async (data: FormData) => {
  try {
    const response = await axiosInstance.post('/create-project', data, {
      headers: {
        'Content-Type': 'multipart/form-data', // Axios automatically handles this, but it's good to specify
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to submit project');
  }
};

const CreateProject = () => {
  const [value, setValue] = useState<string>('');
  const { allUsers, loading } = useGetUsers();

  // React Hook Form setup with types
  const { register, handleSubmit, formState: { errors }, setValue: formSetValue, watch } = useForm<IFormInput>();

  // Watch for startDate, endDate, and projectImage
  const watchStartDate = watch('startDate');
  const watchEndDate = watch('endDate');
  const watchProjectImage = watch('projectImage');

  // Image upload handlers
  const getImageFileObject = (imageFile: File) => {
    console.log({ imageFile });
    formSetValue('projectImage', imageFile);
  };

  const runAfterImageDelete = (file: File) => {
    console.log({ file });
    formSetValue('projectImage', null);
  };

  // Handle date change for start and end dates
  const handleDateChange = (date: Date | undefined, field: keyof IFormInput) => {
    console.log(`${field} selected date: `, date);
    formSetValue(field, date ? date.toString() : '');
  };

  // React Query mutation for form submission
  const { mutate, isLoading, isError, isSuccess, error, data } = useMutation({
    mutationFn: submitProject,
    onSuccess: (data) => {
      console.log('Project successfully submitted:', data);
      toast({
        title: "Success",
        description: "Project Created Success",
      })
    },
    onError: (error) => {
      console.error('Error submitting project:', error);
      toast({
        title: "Error",
        description: "Something is Fisshy",
      })

    },
  });

  // Form submit handler with typed data
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    // Create FormData object to handle file uploads
    const formData = new FormData();

    // Append other form fields to FormData
    formData.append('projectTitle', data.projectTitle);
    formData.append('severity', data.severity);
    formData.append('startDate', new Date(data.startDate).toISOString()); // Convert to ISO string
    formData.append('endDate', new Date(data.endDate).toISOString());     // Convert to ISO string
    formData.append('projectStatus', data.projectStatus);
    formData.append('assignee', data.assignee);
    formData.append('userId', data.assignee);

    // Append projectImage file to FormData (if available)
    if (data.projectImage) {
      formData.append('projectImage', data.projectImage);
    }

    // Submit the FormData using Axios
    mutate(formData);
  };

  useEffect(() => {
    // Sync the selected date values to the form state on initial render
    if (watchStartDate) {
      console.log('Initial Start Date: ', watchStartDate);
    }
    if (watchEndDate) {
      console.log('Initial End Date: ', watchEndDate);
    }
    if (watchProjectImage) {
      console.log('Current Project Image: ', watchProjectImage);
    }
  }, [watchStartDate, watchEndDate, watchProjectImage]);

  return (
    <>
      <Helmet>
        <title>Create Project</title>
      </Helmet>

      <div className='md:px-20 py-5'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-5'>
            <div>
              <Label htmlFor="create-project" className="mb-2">Project Title</Label>
              <Input
                type="text"
                id="create-project"
                placeholder="Please Enter Title"
                {...register('projectTitle', { required: 'Project title is required' })}
                onChange={(e) => formSetValue('projectTitle', e.target.value)}
              />
              {errors.projectTitle && <span className="text-red-500">{errors.projectTitle.message}</span>}
            </div>

            <div>
              <Label htmlFor="create-project" className='block mb-2'>Project Start Date</Label>
              <DatePickerDemo
                selectedDate={watchStartDate}
                onDateChange={(date: Date) => handleDateChange(date, 'startDate')}
              />
            </div>

            <div>
              <Label htmlFor="create-project" className='block mb-2'>Project End Date</Label>
              <DatePickerDemo
                selectedDate={watchEndDate}
                onDateChange={(date: Date) => handleDateChange(date, 'endDate')}
              />
            </div>

            <div>
              <Label htmlFor="create-project" className='block mb-2'>Project Status</Label>
              <Select
                {...register('projectStatus', { required: 'Project status is required' })}
                onValueChange={(value) => formSetValue('projectStatus', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="create-Saverrity" className="mb-2">Project Severity</Label>
              <Input
                type="text"
                id="create-Saverrity"
                placeholder="Please Enter Severity"
                {...register('severity', { required: 'Severity is required' })}
                onChange={(e) => formSetValue('severity', e.target.value)}
              />
              {errors.severity && <span className="text-red-500">{errors.severity.message}</span>}
            </div>

            <div>
              <Label htmlFor="create-project" className='block mb-2'>Project Assignee</Label>
              <Select
                {...register('assignee', { required: 'Assignee is required' })}
                onValueChange={(value) => formSetValue('assignee', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Assignee" />
                </SelectTrigger>
                <SelectContent>
                  {
                    !loading && allUsers?.map((item, index) => (
                      <SelectItem key={index} value={item?._id!}>{item?.username}</SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <ImageUploader
                onFileAdded={(img) => getImageFileObject(img)}
                onFileRemoved={(img) => runAfterImageDelete(img)}
              />
            </div>

            <div className="col-span-2">
              <ReactQuill theme="snow" style={{ height: 150 }} value={value} onChange={setValue} />
            </div>
          </div>

          <div className="mt-12">
            <Button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button>
          </div>

          {isError && <div className="text-red-500 mt-2">Failed to submit project. Please try again.</div>}
        </form>
      </div>
    </>
  );
};

export default CreateProject;
