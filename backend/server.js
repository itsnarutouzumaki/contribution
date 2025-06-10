import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as auth from "./controller/auth.controller.js";
import * as marks from "./controller/marks.controller.js";
import { statCard } from "./controller/statCard.controller.js";
import connectDB from "./db/connectDB.db.js";

dotenv.config();

const app = express();
const PORT = 4000;

/**
 * An array of allowed origins for Cross-Origin Resource Sharing (CORS).
 * Only requests originating from these URLs will be permitted by the server.
 *
 * @type {string[]}
 * @constant
 * @example
 * // Usage in CORS middleware
 * app.use(cors({
 *   origin: allowedOrigins
 * }));
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS}
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://assystantcontribution.netlify.app",
  process.env.FRONTEND_URL,
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

connectDB();

app.use(express.json());
app.use(cookieParser());

app.get("/auth/github", auth.auth);

app.get("/auth/github/callback", auth.authCallback);

app.post("/get/marks", marks.getMarks);

app.get("/getcard", statCard);

app.listen(PORT, () => {
  console.log(`✅ Backend running`);
});
