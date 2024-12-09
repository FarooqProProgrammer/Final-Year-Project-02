import express from "express"
import { createTask, deleteTask, getAllTasks, getTaskById, getTasksByProject, getTasksByStatus, updateTask, updateTaskStatus } from "../controller/task-controller.js";
const taskRouter = express.Router();

taskRouter.post('/task', createTask);
taskRouter.put('/update-task/:taskId', updateTask);
taskRouter.post('/task/:id', deleteTask);
taskRouter.get("/task/status/:status", getTasksByStatus);
taskRouter.get("/task/:taskId", getTaskById);
taskRouter.put("/task/:taskId/status", updateTaskStatus);
taskRouter.get("/project/:projectId", getTasksByProject);
taskRouter.get('/tasks', getAllTasks);




export default taskRouter;