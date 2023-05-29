import postModel from "./post.model";

class PostService {
  private post = postModel;
  public async createPost(name: string, url: string, userId: string) {
    try {
      const post = await this.post.create({ name, url, user: userId });
      return post;
    } catch (error) {
      throw new Error("Unable to create Post");
    }
  }
  public async getAllPost(userId: string) {
    try {
      const posts = await this.post.find({ user: userId });
      return posts;
    } catch (error) {
      throw new Error("Unable to Get Post");
    }
  }
  public async searchPost(name: any , userId: string) {
    try {
      const keyword = name?{
        $or: [
          { name: { $regex: name, $options: "i" } },
        ]
      }:{};

      const posts = await this.post.find(
        { user: userId, ...keyword },
      );
      return posts;
    } catch (error) {
      throw new Error("Unable to Get Post");
    }
  }
}

export default PostService;
