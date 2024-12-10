import express from "express"
import multer from "multer"
import { createProject, deleteManyProjects, deleteProduct, getAllProjectCount, getAllProjects, getSingle, updateProject } from "../controller/project-controller.js";
import path from "path"
import Task from "../models/Task.js";
import ProjectModel from "../models/Project.js";


const projectRouter = express.Router();



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});


const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
    }
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } })


projectRouter.post("/create-project", upload.single("projectImage"), createProject)
projectRouter.put('/update-project/:projectId', updateProject);
projectRouter.get("/get-all-project", getAllProjects)
projectRouter.get("/get-all-project-count", getAllProjectCount)
projectRouter.get("/get-project/:id", getSingle);
projectRouter.post('/delete-projects', deleteManyProjects);
projectRouter.delete('/delete-project/:id', deleteProduct);


projectRouter.get('/total-counts', async (req, res) => {
    try {
        const totalCounts = await ProjectModel.countDocuments();
        const TaskCount = await Task.countDocuments();

        const TaskCompleted = await Task.find({ taskStatus: 'Completed' }).countDocuments();
        const InProgress = await Task.find({ taskStatus: 'In Progress' }).countDocuments();


        res.status(200).json({ project: totalCounts, TaskCount, completedTask: TaskCompleted ,InProgress});


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve total counts', error: error.message });
    }
})


export default projectRouter