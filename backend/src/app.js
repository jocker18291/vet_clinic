import express from "express";

const app = express();

app.use(express.json());

import userRouter from './routes/user.routes.js'
import animalRouter from './routes/animal.routes.js'
import vetRouter from './routes/vet.routes.js'
import visitRouter from './routes/visit.routes.js'
import availabilityRouter from './routes/vetavail.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/animals", animalRouter)
app.use("/api/v1/vet", vetRouter)
app.use("/api/v1/visit", visitRouter)
app.use("/api/v1/availability", availabilityRouter)

export default app;
