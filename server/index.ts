import express from "express";

import morgan from "morgan";
import cors from "cors";

import trips from "./routes/trip";
import cities from "./routes/city";
import cars from "./routes/car";

const app = express();

app.use(morgan("combined"));
app.use(cors());
app.use(express.json());

app.use("/api", trips);
app.use("/api", cities);
app.use("/api", cars);


const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);