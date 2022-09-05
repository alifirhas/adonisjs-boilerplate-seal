import BaseService from "App/Base/Services/BaseService"
import PostRepository from "App/Repositories/Post/PostRepository"

export default class PostService extends BaseService {
  constructor() {
    super(new PostRepository())
  }
}
