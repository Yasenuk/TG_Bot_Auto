import express from "express";

import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

import trips from "./routes/trip";

dotenv.config();

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.use("/api", trips);

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);