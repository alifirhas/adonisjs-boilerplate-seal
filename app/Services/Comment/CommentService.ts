import BaseService from "App/Base/Services/BaseService"
import CommentRepository from "App/Repositories/Comment/CommentRepository"

export default class CommentService extends BaseService {
  constructor() {
    super(new CommentRepository())
  }
}
    