import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import { errorMiddleware } from "./middlewares/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import connectDB from "./config/mongodb.js";

// app config
dotenv.config();
const app = express();
const port = process.env.PORT || 4000;

// Connect to database (CALL THE FUNCTION)
connectDB();

// middlewares
app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["POST"],
    credentials: true,
    allowedHeaders: ["Content-Type"],
}));
app.use(express.urlencoded({ extended: true }));

// api endpoints
app.use("/api/v1/reservation", reservationRouter);

app.get("/", (req, res) => {
    res.send("API Working")
});

app.get('/test-db', (req, res) => {
    const state = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (state === 1) {
        res.send('Database is connected');
    } else {
        res.status(500).send('Database is NOT connected');
    }
});

app.use(errorMiddleware);

app.listen(port, () => console.log(`Server started on PORT:${port}`))
