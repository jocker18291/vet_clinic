import express from "express";

const app = express();

app.use(express.json());

import userRouter from './routes/user.routes.js'
import animalRouter from './routes/animal.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/animals", animalRouter)

export default app;