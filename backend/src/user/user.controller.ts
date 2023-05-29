import { NextFunction, Router, Response, Request } from "express";
import validationMiddleware from "../middlewares/validation.middleware";
import Controller from "../utils/controller.interface";
import HttpException from "../utils/http.exception";
import validate from "./user.validation";
import UserService from "./user.service";
import authenticatedMiddleware from "../middlewares/auth.middleware";
import IReqType from "./util/IReqType";

export default class UserController implements Controller {
  public path = "/users";
  public router = Router();
  private UserService = new UserService();

  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.get("/", (req, res) => {
      res.json("Testing");
    });
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(validate.register),
      this.register
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(validate.login),
      this.login
    );
    this.router.get(`${this.path}/me`, authenticatedMiddleware, this.me);
  }
  private register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      
      const { name, email, password } = req.body;

      const token = await this.UserService.registerUser(name, email, password);

      return res.status(201).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { email, password } = req.body;
      const token = await this.UserService.loginUser(email, password);
      return res.status(200).json({ token });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };

  private me = async (
    req: IReqType,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      if (!req.user) {
        next(new HttpException(400, "User not found"));
      }
      return res.status(200).json({ user: req.user });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}
