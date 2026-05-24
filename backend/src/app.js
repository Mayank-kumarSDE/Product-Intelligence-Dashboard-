import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.config.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { apiRouter } from "./routes/index.js";

export const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true
  })
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ success: true, message: "Quantacus API is healthy" });
});

app.use("/api", apiRouter);
app.use(errorMiddleware);
