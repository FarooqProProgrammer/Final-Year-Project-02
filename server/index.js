import express from 'express';
import dotenv from 'dotenv';
import http from 'http'; 
import { Server as socketIo } from 'socket.io'; 
import chalk from 'chalk'; 
import connectDb from './config/db.js';
import authRouter from './routes/auth-routes.js';


dotenv.config();

const app = express();

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

// Start the server with an airplane icon and color
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(chalk.cyan.bold(`✅ Server is Running on port http://localhost:${PORT}`));
});
