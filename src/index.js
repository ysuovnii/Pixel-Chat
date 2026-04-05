import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from "url";
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './lib/db.js';
import authRoute from './routes/auth.route.js'
import homeRoute from './routes/home.route.js';
import messageRoute from './routes/message.route.js'; 
import requestRoute from './routes/request.route.js';
import Message from './models/message.model.js';
import cookieParser from "cookie-parser";
import ml from './middleware/auth.middleware.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
import { encrypt } from './lib/encryption.js';
const PORT = process.env.PORT;
const { authVerify, authPage } = ml;

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const onlineUsers = new Map();

// socket io for real time chatting 
io.on("connection", (socket) => {
    console.log("User connected : ", socket.id);

    socket.on("userJoin", ({ username, profilePic }) => {
        onlineUsers.set(username, { socketId: socket.id, profilePic });
        const userList = [];
        for (const [uname, data] of onlineUsers) {
            userList.push({ username: uname, profilePic: data.profilePic });
        }
        io.emit("onlineUsers", userList);
    });

    socket.on("sendMessage", async ({ from, to, message, profilePic }) => {
        const payload = { from, to, message, profilePic };

        const {cipherText, iv} = encrypt(message);

        const newMsg = new Message({
            senderID : from,
            receiverID : to, 
            cipherText,
            iv
        })

        await newMsg.save();

        console.log("Saved : ", newMsg);

        // Send to the recipient if they are online
        const recipient = onlineUsers.get(to);
        if (recipient) {
            io.to(recipient.socketId).emit("receiveMessage", payload);
        }
        // Also send back to sender so they see their own message
        socket.emit("receiveMessage", payload);
    });

    socket.on("typing", ({ from, to }) => {
        const recipient = onlineUsers.get(to);
        if (recipient) {
            io.to(recipient.socketId).emit("userTyping", { from });
        }
    });

    socket.on("stopTyping", ({ from, to }) => {
        const recipient = onlineUsers.get(to);
        if (recipient) {
            io.to(recipient.socketId).emit("userStopTyping", { from });
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        for (const [username, data] of onlineUsers) {
            if (data.socketId === socket.id) {
                onlineUsers.delete(username);
                break;
            }
        }
        const userList = [];
        for (const [uname, data] of onlineUsers) {
            userList.push({ username: uname, profilePic: data.profilePic });
        }
        io.emit("onlineUsers", userList);
    });
});

//using ejs for SSR
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());


// route
app.use('/', authRoute);
app.use('/', authPage, homeRoute);
app.use('/', authVerify, requestRoute);
app.use("/message", authVerify, messageRoute);

// entry point 
server.listen(PORT, () => {
    console.log(`Server running at PORT : ${PORT}`);
    connectDB();
});