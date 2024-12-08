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

export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params; // Assuming you are passing project ID in the URL parameter
        const { projectTitle, severity, startDate, endDate, projectStatus, assignee, userId } = req.body;

        // Find the project by its ID
        const project = await ProjectModel.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Process new image if uploaded
        let projectImageUrl = project.projectImage; // Keep the old image URL if no new image is uploaded
        if (req.file) {
            // If a new file is uploaded, delete the old image if it exists
            if (projectImageUrl) {
                const oldImagePath = path.join(__dirname, `..${projectImageUrl}`);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath); // Delete the old image from the server
                }
            }
            
            // Set the new image URL
            projectImageUrl = `/uploads/${req.file.filename}`;
        }

        // Update project fields with new data (and new image URL if applicable)
        project.projectTitle = projectTitle;
        project.severity = severity;
        project.startDate = startDate;
        project.endDate = endDate;
        project.projectStatus = projectStatus;
        project.assignee = assignee;
        project.userId = userId;
        project.projectImage = projectImageUrl; // Save the updated image URL

        // Save the updated project to the database
        await project.save();

        return res.status(200).json({ message: 'Project updated successfully', project });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update project', error: error.message });
    }
};

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
            .populate('userId', 'username email') 
            .exec(); 

       
        if (!projects.length) {
            return res.status(404).json({ message: 'No projects found' });
        }

        return res.status(200).json({ projects });
    } catch (error) {
        console.error('Error fetching projects:', error);

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
