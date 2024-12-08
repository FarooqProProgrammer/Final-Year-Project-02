import Task from "../models/Task.js";

// Create a new task
export const createTask = async (req, res) => {
    try {
        const { taskName, taskDescription, taskStatus, project, assignee } = req.body;

        const newTask = new Task({
            taskName,
            taskDescription,
            taskStatus,
            project,
            assignee,
        });

        await newTask.save();
        res.status(201).json({
            message: "Task created successfully!",
            task: newTask,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, unable to create task." });
    }
};

// Get tasks by status
export const getTasksByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const tasks = await Task.find({ taskStatus: status });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found with this status." });
        }

        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, unable to fetch tasks." });
    }
};



export const getAllTasks = async (req, res) => {
    try {
        // Fetch all tasks from the database
        const tasks = await Task.find().populate("assignee").populate("project");

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found." });
        }

        // Send the tasks in the response
        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, unable to fetch tasks." });
    }
};

// Get a task by ID
export const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, unable to fetch task." });
    }
};

// Update a task's status
export const updateTaskStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { newStatus } = req.body;

        const task = await Task.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found." });
        }

        task.taskStatus = newStatus;
        await task.save();

        res.status(200).json({
            message: "Task status updated successfully!",
            task,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, unable to update status." });
    }
};

// Get tasks by project ID
export const getTasksByProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const tasks = await Task.find({ project: projectId });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this project." });
        }

        res.status(200).json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error, unable to fetch tasks." });
    }
};
