import cors from "cors";
import express, { Request, Response } from "express";
import fileUpload from "express-fileupload";
import { createServer } from "http";
import * as mongoose from "mongoose";
import { Server } from "socket.io";
import * as swaggerUi from "swagger-ui-express";

import * as swaggerDocument from "../src/unils/swagger.json";
import { configs } from "./configs/config";
import { cronRunner } from "./crons";
import { authRouter } from "./router/auth.router";
import { carsRouter } from "./router/cars.router";
import { filesRouter } from "./router/files.router";
import { userRouter } from "./router/user.router";

const app = express();
app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3004;

const server = createServer(app);

const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("login", ({ data }) => {
    console.log(data);
  });
});

server.listen(PORT, () => {
  mongoose.connect(`${configs.DB_URI}`);
  cronRunner();
  console.log(`Server has successfully started on PORT ${PORT}`);
});

app.use("/users", userRouter);
app.use("/cars", carsRouter);
app.use("/auth", authRouter);
app.use("/file", filesRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((err: any, req: Request, res: Response, next: NewableFunction) => {
  const status = err.status || 500;
  res.status(status).json(err.message);
});
