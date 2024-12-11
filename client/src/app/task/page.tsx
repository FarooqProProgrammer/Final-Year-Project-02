"use client";
import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useDeleteTaskMutation, useGetAllTaskQuery, useUpdateTaskMutation } from "@/store/services/apiSlice";
import { PencilIcon, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Projects = () => {
  const router = useRouter();
  const { data, refetch } = useGetAllTaskQuery();
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();
  const [updateTask, { isLoading: updateLoading }] = useUpdateTaskMutation();

  const [currentTask, setCurrentTask] = useState<any>(null);
  const [taskName, setTaskName] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [updateResponse, setUpdateResponse] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [startDate, setStartDate] = useState(""); // State for start date filter
  const [endDate, setEndDate] = useState(""); // State for end date filter

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id).unwrap();
      console.log(`Task ${id} deleted successfully`);
      refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleUpdateTask = (task: any) => {
    setCurrentTask(task);
    setTaskName(task?.taskName || "");
    setTaskStatus(task?.taskStatus || "");
    setProjectTitle(task?.project?.projectTitle || "");
    setUpdateResponse(null);
  };

  const handleSubmitUpdate = async () => {
    try {
      const updatedTask = {
        taskId: currentTask?._id,
        taskName,
        taskStatus,
        projectTitle,
      };
      const response = await updateTask(updatedTask).unwrap();
      setUpdateResponse("Task updated successfully!");
      refetch();
      console.log("Update Response:", response);
    } catch (error) {
      setUpdateResponse("Failed to update task. Please try again.");
      console.error("Error updating task:", error);
    }
  };

  // Filter tasks based on search term and date range
  const filteredTasks = data?.filter((task) => {
    const taskStartDate = new Date(task?.taskStartDate);
    const taskEndDate = new Date(task?.taskEndDate);
    const startDateFilter = startDate ? new Date(startDate) : null;
    const endDateFilter = endDate ? new Date(endDate) : null;

    const isWithinStartDate =
      !startDateFilter || taskStartDate >= startDateFilter;
    const isWithinEndDate =
      !endDateFilter || taskEndDate <= endDateFilter;

    return (
      (task?.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task?.taskStatus.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task?.project?.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())) &&
      isWithinStartDate &&
      isWithinEndDate
    );
  });

  return (
    <section className="sm:px-20 space-y-4">
      <div className="flex justify-between items-center">
        {/* Create Task Button */}
        <Button onClick={() => router.push("/task/create-task")}>Create Task</Button>

        {/* Search Input */}
        <Input
          type="text"
          placeholder="Search Tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-1/3"
        />
      </div>

   

      <Table className="bg-white rounded-2xl mt-4">
        <TableHeader className="border-b-2 border-gray-600">
          <TableRow>
            <TableHead>Task Name</TableHead>
            <TableHead>Task Status</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTasks?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item?.taskName}</TableCell>
              <TableCell className="font-medium">{item?.taskStatus}</TableCell>
              <TableCell className="font-medium">{item?.project?.projectTitle}</TableCell>
              <TableCell className="font-medium">{item?.taskStartDate}</TableCell>
              <TableCell className="font-medium">{item?.taskEndDate}</TableCell>
              <TableCell className="font-medium flex justify-center items-center">
                <div className="flex justify-center items-center gap-5">
                  <Trash2 className="cursor-pointer" onClick={() => handleDeleteTask(item?._id)} />
                  <Dialog>
                    <DialogTrigger onClick={() => handleUpdateTask(item)}>
                      <PencilIcon className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Task {currentTask?.taskName}</DialogTitle>
                        <DialogDescription>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="taskName">Task Name</Label>
                            <Input
                              type="text"
                              id="taskName"
                              placeholder="Task Name"
                              value={taskName}
                              onChange={(e) => setTaskName(e.target.value)}
                            />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                            <Label htmlFor="taskStatus">Task Status</Label>
                            <Input
                              type="text"
                              id="taskStatus"
                              placeholder="Task Status"
                              value={taskStatus}
                              onChange={(e) => setTaskStatus(e.target.value)}
                            />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                            <Label htmlFor="projectTitle">Project Title</Label>
                            <Input
                              type="text"
                              id="projectTitle"
                              placeholder="Project Title"
                              value={projectTitle}
                              onChange={(e) => setProjectTitle(e.target.value)}
                            />
                          </div>
                          <Button
                            className="mt-4"
                            onClick={handleSubmitUpdate}
                            disabled={updateLoading}
                          >
                            {updateLoading ? "Updating..." : "Submit"}
                          </Button>
                          {updateResponse && (
                            <p className="mt-2 text-sm text-center">
                              {updateResponse}
                            </p>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default Projects;
