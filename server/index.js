import express from 'express';
import dotenv from 'dotenv';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import chalk from 'chalk';
import connectDb from './config/db.js';
import authRouter from './routes/auth-routes.js';
import cors from "cors"
import projectRouter from './routes/project-route.js';
import path from "path"
import { fileURLToPath } from 'url';
import fs from "fs"

dotenv.config();

const app = express();

app.use(express.json())
app.use(express.static("uploads"))
app.use(cors())

// MONGO DB CONNECTION
connectDb();


const server = http.createServer(app);


const io = new socketIo(server);


io.on('connection', (socket) => {
    console.log(chalk.green.bold(`✈️ A new user has connected!`));

    socket.on('message', (data) => {
        console.log(chalk.blue('Received message from client:'), chalk.yellow(data));
    });


    socket.emit('welcome', { message: 'Welcome to the server!' });


    socket.on('disconnect', () => {
        console.log(chalk.red.bold(`✈️ A user has disconnected`));
    });
});

// Example route
app.get('/', (req, res) => {
    res.send('Hello, world!');
});


// ALL APP ROUTES
app.use('/api/auth', authRouter);
app.use('/api', projectRouter);


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');


app.get('/uploads/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);

    // Check if the file exists
    fs.exists(filePath, (exists) => {
        if (exists) {
            // If the file exists, serve it
            res.sendFile(filePath);
        } else {
            // If the file does not exist, return a 404
            res.status(404).json({ message: 'File not found' });
        }
    });
});

// Start the server with an airplane icon and color
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(chalk.cyan.bold(`✅ Server is Running on port http://localhost:${PORT}`));
});
