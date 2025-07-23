import express  from "express";
import repoRoutes from "./routes/repo"

const app = express()

app.use(express.json())

app.use("/repo", repoRoutes)

export default app