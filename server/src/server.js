import app from "./app.js"
import dotenv from "dotenv"
import { validateDB } from './middleware/validateDB.js'

dotenv.config()

const PORT = process.env.PORT || 8080

// async to handle awaiting for DB validation.
async function startServer(){
  // Will end program early if DB connection fails.
  await validateDB();

  // If the program is still alive, DB is good so the server is good to start.
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  });
}

startServer();
