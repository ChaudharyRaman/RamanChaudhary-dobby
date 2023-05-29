import UserController from './user/user.controller';
import App from './app';
import PostController from './post/post.controller';
import { config } from 'dotenv';
config();

const app = new App([
    new UserController(),
    new PostController()
],Number(process.env.PORT));

app.listen();