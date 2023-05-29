import { Schema, model } from "mongoose";
import Post from "./post.interface";

const postSchema = new Schema({
  name: {
    type: String,
    require:true,
  },
  user:{
    type:String,
    require:true
  },
  url:{
    type:String,
    require:true
  }

});

export default model<Post>("Post",postSchema); 