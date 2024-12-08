import express from "express"
import multer from "multer"
import { createProject, deleteManyProjects, getAllProjects, getSingle } from "../controller/project-controller.js";
import path from "path"

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
projectRouter.get("/get-all-project", getAllProjects)
projectRouter.get("/get-project/:id", getSingle);
projectRouter.post('/delete-projects', deleteManyProjects);


export default projectRouter