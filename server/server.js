import express from "express";
import cors from "cors";
import apirouter from "./api/index.js";

const PORT = 3005;

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apirouter);

app.listen(PORT, () => console.log(`Todo Server listening on port ${PORT}!`));
