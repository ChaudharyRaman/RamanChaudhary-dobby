import { Document, Schema } from "mongoose";

export default interface Post extends Document {
    name : string
    user: Schema.Types.ObjectId
    url:string
}