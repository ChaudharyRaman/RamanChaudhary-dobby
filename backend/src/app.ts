import express, { Application, Request, Response } from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import Controller from "./utils/controller.interface";
import ErrorMiddleware from "./middlewares/error.middleware";
import bodyParser from "body-parser";

export default class App {
  public express: Application;
  public port: number;
  constructor(controllers: Controller[], port: number) {
    this.express = express();
    this.port = port;

    this.initialiseDatabaseConnection();
    this.initialeseMiddleware();
    this.initialeseControllers(controllers);
  }
  private initialeseControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.express.use("/", controller.router);
    });
  }

  private async initialiseDatabaseConnection(): Promise<void> {
    mongoose.set("strictQuery", false);
    try {
      await mongoose.connect(`${process.env.MONGO_URI}`);
      console.log("Database connected");
    } catch (error: any) {
      console.log(error.message);
      throw new Error("Database connection failed");
    }
  }

  private initialeseMiddleware(): void {
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(morgan("dev"));
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  }
  public listen(): void {
    this.express.get('/',(req:Request,res:Response)=>{
      res.json("working");
    })
    this.express.use(ErrorMiddleware)
    this.express.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
