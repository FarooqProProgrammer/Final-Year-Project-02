import mongoose from "mongoose"



const projectSchema = new mongoose.Schema({
    projectTitle: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    projectStatus: {
        type: String,
        required: true,
    },
    assignee: {
        type: String,
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',  
        required: true, 
    },
    projectImage: {
        type: String,
        required: false,
    },

}, { timestamps: true })

const ProjectModel = mongoose.model('Project', projectSchema);
export default ProjectModel
