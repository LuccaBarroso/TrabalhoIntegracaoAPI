import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movieRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import cron from "node-cron";
import integracaoArquivo from "./integracaoArquivo.js";

import dotenv from "dotenv";
dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application." });
});

app.use("/api/movies", movieRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);

// cron job a cada 15 segundos
cron.schedule("*/15 * * * * *", integracaoArquivo);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
