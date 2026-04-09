<<<<<<< HEAD
import express from "express";
import cors from "cors";
import customerRouter from "./routes/customerRoutes.js";
import session from "express-session";
import authRoutes from "./routes/authRoutes.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
=======
import express from "express"
import cors from "cors"
import testFirestoreRouter from "./routes/testFirestore.js"
import menuRoutes from "./routes/menuRoutes.js"; 
const app = express()
>>>>>>> MichaelCode

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
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
<<<<<<< HEAD
  res.json({ message: "BrewEase API running" });
});
=======
  res.json({ message: "BrewEase API running" })
})
app.use("/", menuRoutes);
>>>>>>> MichaelCode

app.use("/api/customers", customerRouter);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRouter);

export default app;