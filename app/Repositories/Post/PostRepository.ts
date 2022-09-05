import BaseRepository from "App/Base/Repositories/BaseRepository";
import Post from "App/Models/Post/Post";

export default class PostRepository extends BaseRepository {
  constructor() {
    super(Post)
  }
}
