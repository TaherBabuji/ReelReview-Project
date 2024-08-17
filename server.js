import express from "express";
import cors from "cors";
import movies from "./api/movies.route.js";
import dotenv from "dotenv";

const app = express();

try {
  dotenv.config();
  // const port = process.env.PORT || 8000;
  app.use(cors());
  app.use(express.json());

  app.use("/api/v1/movies", movies);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "not found" });
  });

  // app.listen(port, () => {
  //   console.log(`server is running on port: ${port}`);
  // });
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}

export default app;
