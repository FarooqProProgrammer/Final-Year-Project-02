import mongoose from "mongoose";

// Define the task schema
const taskSchema = new mongoose.Schema(
    {
        taskName: {
            type: String,
            required: true,
            trim: true,  // Optional: Ensure no leading/trailing spaces in task name
        },
        taskDescription: {
            type: String,
            required: true,
            trim: true,  // Optional: Trim spaces for description
        },
        taskStatus: {
            type: String,
            required: true,
            enum: ['not started', 'in progress', 'completed'], // Valid statuses
            default: 'not started', // Default value
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: true,
        },
        assignee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

// Optional: Add an index for better querying performance
taskSchema.index({ project: 1, assignee: 1 });

// Optional: Virtuals to return task status in human-readable format
taskSchema.virtual('statusLabel').get(function () {
    return this.taskStatus.charAt(0).toUpperCase() + this.taskStatus.slice(1);
});

// Optional: Static method to find tasks by status
taskSchema.statics.findByStatus = function (status) {
    return this.find({ taskStatus: status });
};

// Optional: Instance method to update task status
taskSchema.methods.updateStatus = function (newStatus) {
    this.taskStatus = newStatus;
    return this.save();
};

// Create the Task model from the schema
const Task = mongoose.model('Task', taskSchema);

export default Task;
