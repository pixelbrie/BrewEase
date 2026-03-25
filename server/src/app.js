import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: "brewease-dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

app.get("/", (req, res) => {
  res.json({ message: "BrewEase API running" });
});

app.use("/api/auth", authRoutes);

export default app;