import express from "express"
import cors from "cors"

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({ message: "BrewEase API running" })
})

export default app
