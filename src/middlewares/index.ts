// import
import express from "express";
import cors from "cors";
import logger from "morgan";

export default [cors(), logger("dev"), express.json()];
