import express from "express";
import path from "path";
import ejs from "ejs";
import pdf from "html-pdf";
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

        // Set the response headers for PDF
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", 'attachment; filename="report.pdf"');

        // Render the HTML with the data using EJS
        const ejsData = {
            generatedOn: new Date().toLocaleString(),
            tableData: tableData,
        };

        const html = await ejs.renderFile(path.join(__dirname, '../views/report.ejs'), ejsData);

        // Generate the PDF from the HTML content
        pdf.create(html, { format: 'A4' }).toBuffer((err, pdfBuffer) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Error generating PDF");
            }
            // Send the generated PDF as a response
            res.send(pdfBuffer);
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error processing request");
    }
});

export default reportRouter;
