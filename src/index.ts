import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
config();
import { AppDataSource } from "./data-source";
import { apiRouter } from "./routes";

const app = express();
const port = 4000;

app.use(cors({ origin: ['http://localhost:3000', '*'], credentials: true }));
app.use(express.json())
app.use(express.static('public'))
app.use(cookieParser("secret"));
app.use("/api", apiRouter);

AppDataSource
    .initialize()
    .then(() => {
        app.listen(port, () => console.log(`[SERVER]: Listening on http://localhost:${port}`));
    })
    .catch((error) => console.log(error.message));
