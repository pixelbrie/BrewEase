import express from "express"
import cors from "cors"
import testFirestoreRouter from "./routes/testFirestore.js"

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "BrewEase API running" })
})

app.use("/api", testFirestoreRouter)

export default app