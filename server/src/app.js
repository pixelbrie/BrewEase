import express from "express"
import cors from "cors"
import testFirestoreRouter from "./routes/testFirestore.js"
import orderRoutes from "./routes/orderRoutes.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "BrewEase API running" })
})

app.use("/api", testFirestoreRouter)
app.use("/orders", orderRoutes)

export default app