import express from "express";
import { resolve } from "path";
import cors from "cors";
import router from "./routes/index.js";
import { Html } from "../src/html.js";

const server = express();
const __dirname = process.cwd();

const middleware = [
  express.static(resolve(__dirname, "dist")),
  express.json(),
  cors({
    credentials: true,
    origin: "http://localhost:3000"
  })
];
middleware.forEach(it => server.use(it));

// server.use(express.json());
// server.use(
//   cors({
//     credentials: true,
//     origin: 'http://localhost:3000'
//   })
// );
server.get("/*", (req, res) => {
  const initialState = {
    location: req.url
  };
  res.send(
    Html({
      body: "",
      initialState
    })
  );
});
server.use("/api", router);

const start = () => {
  try {
    server.listen(9000, () => console.log("Server started on PORT = 9000"));
  } catch (e) {
    console.log(e);
  }
};
start();
