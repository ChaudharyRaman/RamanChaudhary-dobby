import { Request, Response, NextFunction } from "express";
import token from '../utils/token';
import Token from '../utils/token.interface';
import HttpException from '../utils/http.exception';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import userModel from "../user/user.model";
import IReqType from "user/util/IReqType";

async function authenticatedMiddleware(
    req: IReqType,
    res: Response,
    next: NextFunction
): Promise<Response | void> {
    const bearer = req.headers.authorization;
    if (!bearer || !bearer.startsWith('Bearer ')) {
        return next(new HttpException(401,'Unauthorised User'));
    }

    const tokenString = bearer.split('Bearer ')[1].trim();
    try {
        const payload :Token | jwt.JsonWebTokenError = await token.verifyToken(tokenString);
        
        if(payload instanceof JsonWebTokenError){
            return next(new HttpException(401,'Unauthorised User'));
        }
        const user = await userModel.findById(payload.id)
            .select('-password')
            .exec();
        if(!user){
            return next(new HttpException(401,'Unauthorised User'));
        }
        req.user = user;
        return next();
    } catch (error) {
        return next(new HttpException(401,'Unauthorised User'));
    }
}

export default authenticatedMiddleware;

