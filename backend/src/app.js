import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


export {app}

import userRouter from "./routes/user.route.js";
import documentRouter from "./routes/document.route.js";
app.use("/api/v1/users", userRouter)
app.use("/api/v1/documents", documentRouter)  
