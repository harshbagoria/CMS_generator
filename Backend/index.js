import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import Router from "./Routes/v1/index.js";

dotenv.config();

const app = express();
app.use('/v1', Router);

connectDB();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.use((req, res)=>{
  res.status(404).json({ message: "404 Not found" });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});