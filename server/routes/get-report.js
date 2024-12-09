import express from "express";
import path from "path";
import ejs from "ejs";
import pdf from "html-pdf";
import fs from "fs";
import { fileURLToPath } from "url";
import Task from "../models/Task.js";

const reportRouter = express.Router();



reportRouter.get("/get-report", async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignee").populate("project");

        // Format the dates in the backend
        const tableData = tasks.map(task => ({
            ...task.toObject(),
            fromDate: task.fromDate ? new Date(task.createdAt).toISOString().split("T")[0] : "N/A",
            toDate: task.toDate ? new Date(task.createdAt).toISOString().split("T")[0] : "N/A",
        }));

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        // Render the HTML with the data using EJS
        const ejsData = {
            generatedOn: new Date().toLocaleString(),
            tableData: tableData,
        };

        const html = await ejs.renderFile(path.join(__dirname, "../views/report.ejs"), ejsData);

        // Define the output PDF file path in the "upload" folder
        const fileName = `report_${Date.now()}.pdf`;  // Unique file name using timestamp
        const outputFilePath = path.join(__dirname, "../uploads", fileName);

        // Generate the PDF and save it to the "upload" folder
        pdf.create(html, { format: "A4" }).toFile(outputFilePath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error generating PDF");
            }

            // Return the file URL to the client
            const fileUrl = `http://localhost:3001/uploads/${fileName}`;
            res.json({ fileUrl: fileUrl });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing request");
    }
});

export default reportRouter;
