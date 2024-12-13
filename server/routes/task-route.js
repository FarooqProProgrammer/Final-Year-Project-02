import express from "express"
import multer from "multer"
import { createTask, deleteTask, getAllTasks, getTaskById, getTasksByProject, getTasksByStatus, updateTask, updateTaskStatus } from "../controller/task-controller.js";
const taskRouter = express.Router();
import path from "path"

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads'); // Save uploaded images in the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"), false);
    }
};

// Initialize Multer
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

taskRouter.post('/task', upload.single('taskImage'),createTask);
taskRouter.put('/update-task/:taskId', updateTask);
taskRouter.post('/task/:id', deleteTask);
taskRouter.get("/task/status/:status", getTasksByStatus);
taskRouter.get("/task/:taskId", getTaskById);
taskRouter.put("/task/:taskId/status", updateTaskStatus);
taskRouter.get("/project/:projectId", getTasksByProject);
taskRouter.get('/tasks', getAllTasks);




export default taskRouter;