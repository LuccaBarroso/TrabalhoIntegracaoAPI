import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
// import session from "express-session";
import rateLimit from "express-rate-limit";
import compression from "compression";
import helmet from "helmet";

import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(compression());

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Limit requests to 100 per hour per IP address
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: "Too many requests from this IP, please try again tomorrow.",
});

app.use(limiter);

// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);

app.use("/api/users", userRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server running on port 3000");
});
