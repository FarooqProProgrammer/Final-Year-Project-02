import ProjectModel from "../models/Project.js";

export const createProject = async (req, res) => {
    try {
        const { projectTitle, severity, startDate, endDate, projectStatus, assignee, userId } = req.body;

        let projectImageUrl = '';
        if (req.file) {
            // If a file is uploaded, get its URL
            projectImageUrl = `/uploads/${req.file.filename}`;
        }

        const newProject = new ProjectModel({
            projectTitle,
            severity,
            startDate,
            endDate,
            projectStatus,
            assignee,
            userId,
            projectImage: projectImageUrl, // Save the image URL to MongoDB
        });

        await newProject.save();
        return res.status(201).json({ message: 'Project created successfully', project: newProject });


    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to create project', error: error.message });
    }
}

export const getAllProjects = async (req, res) => {
    try {
        // Find all projects and populate userId with specific fields (optional)
        const projects = await ProjectModel.find()
            .populate('userId', 'username email') // Replace 'username' and 'email' with the fields you need
            .exec(); // Ensure that the query is executed

        // If no projects found, return a 404 response
        if (!projects.length) {
            return res.status(404).json({ message: 'No projects found' });
        }

        // Return the projects with a 200 OK response
        return res.status(200).json({ projects });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching projects:', error);

        // Return a 500 Internal Server Error response
        return res.status(500).json({ message: 'Failed to retrieve projects', error: error.message });
    }
};

export const getSingle = async (req, res) => {
    try {
        

        const id = req.params.id;

        const projects = await ProjectModel.find({ _id:id })
            .populate('userId', 'username email') // Replace 'username' and 'email' with the fields you need
            .exec(); // Ensure that the query is executed

        // If no projects found, return a 404 response
        if (!projects.length) {
            return res.status(404).json({ message: 'No projects found' });
        }

        // Return the projects with a 200 OK response
        return res.status(200).json({ projects });
    } catch (error) {
        // Log the error for debugging purposes
        console.error('Error fetching projects:', error);

        // Return a 500 Internal Server Error response
        return res.status(500).json({ message: 'Failed to retrieve projects', error: error.message });
    }
};


export const deleteManyProjects = async (req, res) => {
    try {

        
        const { ids } = req.body; // Expect an array of project IDs to delete

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'No project IDs provided' });
        }

        // Perform the delete operation
        const result = await ProjectModel.deleteMany({ _id: { $in: ids } });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No projects found with the given IDs' });
        }

        return res.status(200).json({
            message: `${result.deletedCount} project(s) deleted successfully`,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to delete projects', error: error.message });
    }
};
