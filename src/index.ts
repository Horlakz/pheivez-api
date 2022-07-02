// import express and other dependencies
import express, { Application } from "express";
import cors from "cors";
import logger from "morgan";
import "dotenv/config";

// import functions
import routes from "./routes/testRoute";
import { appError } from "./middlewares/error";
import connectDB from "./config/db";

// connect to database
connectDB();

// initialize express
const app: Application = express();

// json parser
app.use(express.json());

// use middleware when in development
if (process.env.NODE_ENV === "development") {
  app.use(cors());
  app.use(logger("dev"));
}

// cors
app.use(
  cors({
    origin:
      "http://localhost:4252, https://pheivez.netlify.app, https://pheivez.com",
  })
);

// routes
app.use("/api/v1/", routes);

// error handler
app.use(appError);

// set port
const port: string | number = process.env.PORT || 8000;

// run server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
