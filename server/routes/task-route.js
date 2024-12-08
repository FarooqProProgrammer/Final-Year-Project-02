import express from "express"
import { createTask, getAllTasks, getTaskById, getTasksByProject, getTasksByStatus, updateTaskStatus } from "../controller/task-controller.js";
const taskRouter = express.Router();

taskRouter.post('/task',createTask);
taskRouter.get("/task/status/:status", getTasksByStatus);
taskRouter.get("/task/:taskId", getTaskById);
taskRouter.put("/task/:taskId/status", updateTaskStatus);
taskRouter.get("/project/:projectId", getTasksByProject);
taskRouter.get('/tasks', getAllTasks);




export default taskRouter;