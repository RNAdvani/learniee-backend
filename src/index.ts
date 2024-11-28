import express from "express";
import { connectDb } from "./lib/db";
import { setupSocket } from "./socket";
import { createServer } from "http";

import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorMiddleware } from "./lib/ErrorHandler";
import { userRoutes } from "./routes/user.routes";
import { messageRoutes } from "./routes/message.routes";
import morgan from "morgan";

connectDb();

const app = express();
const http = createServer(app);

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], 
    credentials: true,
}));


app.use(express.json());
app.use(cookieParser());

setupSocket(http);

app.use(morgan("dev"));

app.use("/api/user",userRoutes);
app.use("/api/messages",messageRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


export default app;