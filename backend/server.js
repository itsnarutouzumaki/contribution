import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as auth from './controller/auth.controller.js';
import * as marks from './controller/marks.controller.js';

dotenv.config();

const app = express();
const PORT = 4000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://assystantcontribution.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(express.json());
app.use(cookieParser());

app.get("/auth/github", auth.auth);

app.get("/auth/github/callback", auth.authCallback);

app.post("/get/marks", marks.getMarks);

app.listen(PORT, () => {
  console.log(`✅ Backend running`);
});
