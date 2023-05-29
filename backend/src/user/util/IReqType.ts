import { Request } from "express"
import User from "user/user.interface"
export default interface IReqType extends Request {
    user? : User
}