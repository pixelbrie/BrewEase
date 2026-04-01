<<<<<<< HEAD
import express from "express"
import cors from "cors"
import testFirestoreRouter from "./routes/testFirestore.js"
import customerRouter from "./routes/customerRoutes.js"
=======
import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
>>>>>>> origin/main

const app = express();
const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
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

<<<<<<< HEAD
app.use("/api", testFirestoreRouter)
app.use("/api/customers", customerRouter)
=======
app.use("/api/auth", authRoutes);
>>>>>>> origin/main

export default app;
