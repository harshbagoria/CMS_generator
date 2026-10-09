import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import v1Routes from "./Routes/v1/index.js";

dotenv.config();


const app = express();

connectDB();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.use("/api/v1", v1Routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});