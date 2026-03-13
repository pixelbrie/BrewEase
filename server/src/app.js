import express from "express"
import cors from "cors"
import customerRouter from "./routes/customerRoutes.js"
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";

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

// Routes
const authRoutes = require('./routes/authRoutes.js')
app.use('/api/auth', authRoutes)

app.get("/", (req, res) => {
  res.json({ message: "BrewEase API running" });
});

app.use("/api/customers", customerRouter)
app.use("/api/auth", authRoutes);

export default app;
