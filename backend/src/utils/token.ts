import jwt from "jsonwebtoken";
import User from "../user/user.interface";
import Token from "./token.interface";

const createToken = (user: User): string => {
  const expiresIn = 60 * 60;
  const secret = process.env.JWT_SECRET;
  const dataStoredInToken: Token = {
    id: user._id,
    expiresIn: expiresIn,
  };
  return jwt.sign({ id: user._id }, secret as jwt.Secret, {
    expiresIn: expiresIn,
  });
};

const verifyToken = async (
  token: string
): Promise<jwt.VerifyErrors | Token> => {
  const secret = process.env.JWT_SECRET;
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret as jwt.Secret, (err:any, decoded:any) => {
      if (err) return reject(err);
      resolve(decoded as Token);
    });
  });
};

export default { createToken, verifyToken };
