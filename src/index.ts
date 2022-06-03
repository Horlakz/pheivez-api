// all imports
// import express and types
import express, { Application } from "express";

import "dotenv/config";
import middlewares from "./middlewares";
import routes from "./routes/testRoute";
import connectDB from "./config/db";

// connect to database
connectDB();

// initialize express
const app: Application = express();

// middlewares
middlewares.map((middleware) => app.use(middleware));

// routes
app.use("/api/v1/", routes);

// set port
const port: string | number = process.env.PORT || 8000;

// run server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
