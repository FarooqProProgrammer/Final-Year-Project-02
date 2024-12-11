import mongoose from "mongoose";
import slug from "mongoose-slug-updater";

// Initialize the slug plugin
mongoose.plugin(slug);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      slug: "projectTitle",
      unique: true, // Ensures the slug is unique
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
 
    tags: {
      type: Array,
      required: true,
    },
    assign: {
      type: Array,
      required: true,
    
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    
    },
    projectImage: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const ProjectModel = mongoose.model("Project", projectSchema);
export default ProjectModel;
