// import express and other dependencies
import express, { Application } from "express";
import cors from "cors";
import logger from "morgan";
import "dotenv/config";

// import functions
import routes from "./routes";
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

// set request header
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

// cors middleware
app.use(
  cors({ origin: process.env.CORS_ORIGIN })
);

// routes middeware
app.use("/api/v1/", routes);

// error handler
app.use(appError);

// set port
const port: string | number = process.env.PORT || 8000;

// run server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
