import { Document } from "mongoose";

interface User extends Document {
    name: string;
    email: string;
    password: string;

    isValidPassword(password:string): Promise<Error | boolean>;

}

export default User;