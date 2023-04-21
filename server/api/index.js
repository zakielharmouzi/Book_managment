import { Router } from "express";
import todoRouter from "./routes/todo.js";

const apirouter = Router();

apirouter.use("/", todoRouter);
export default apirouter;
