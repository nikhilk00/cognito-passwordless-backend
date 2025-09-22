import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/auth";
import errorHandler from "./middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined"));

app.use("/auth", authRoutes);

// health
app.get("/health", (req: Request, res: Response) => res.json({ ok: true }));

// error handler
app.use(errorHandler);

export default app;
