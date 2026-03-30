import express from "express"
import cors from "cors"
import orderRoutes from "./routes/orderRoutes.js"
import authRoutes from "./routes/authRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "BrewEase API running" })
})

app.use("/api/auth", authRoutes)
app.use("/api/orders", orderRoutes)

export default app