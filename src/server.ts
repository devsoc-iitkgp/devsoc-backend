import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mainRouter from './Routers';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1",mainRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});