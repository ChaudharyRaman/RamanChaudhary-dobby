import { NextFunction, Request, Response, Router } from "express";
import authenticatedMiddleware from "../middlewares/auth.middleware";
import Controller from "utils/controller.interface";
import PostService from "./post.service";
import HttpException from "../utils/http.exception";
import IReqType from "user/util/IReqType";

export default class PostController implements Controller {
  public path = "/post";
  public router = Router();
  private PostService = new PostService();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes(): void {
    this.router.post(`${this.path}`, authenticatedMiddleware, this.createPost);
    this.router.get(
      `${this.path}/search`,
      authenticatedMiddleware,
      this.searchPost
    );
    this.router.get(`${this.path}`, authenticatedMiddleware, this.getAllPost);
  }
  private createPost = async (
    req: IReqType,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name, url } = req.body;

      const post = await this.PostService.createPost(name, url, req.user?._id);
      return res.status(201).json({
        status: "success",
        post,
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
  private getAllPost = async (
    req: IReqType,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const posts = await this.PostService.getAllPost(req.user?._id);

      return res.status(201).json({
        status: "success",
        posts,
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
  private searchPost = async (
    req: IReqType,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { name } = req.query;

      const posts = await this.PostService.searchPost(name);
      return res.status(201).json({
        status: "success",
        posts
      });
    } catch (error: any) {
      next(new HttpException(400, error.message));
    }
  };
}
