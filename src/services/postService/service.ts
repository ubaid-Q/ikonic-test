import { AppDataSource } from "../../data-source";
import { Filter } from "../../models";
import { User } from "../userService/user.entity";
import { Post } from "./post.entity";

export class PostService {
  constructor(private postRepository = AppDataSource.getRepository(Post)) {}

  get(filter?: Filter): Promise<Post[]> {
    const take = 10;
    const skip = (filter?.page - 1) * take;
    return this.postRepository.find({
      relations: { user: true, comments:{user:true} },
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      skip,
      take,
    });
  }

  getById(id: number) {
    return this.postRepository.findOne({
      where: { id },
      relations: { user: true, comments:{user:true} },
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });
  }

  getByUser(email: string, filter: Filter) {
    const take = 10;
    const skip = (filter?.page - 1) * take;
    return this.postRepository.find({
      where: { user: { email } },
      relations: { comments:{user:true}, user: true },
      skip,
      take,
    });
  }

  create(data: Post) {
    return this.postRepository.save(data);
  }

  update(id: number, data) {
    return this.postRepository.update({ id }, data);
  }

  delete(id: number) {
    return this.postRepository.delete({ id });
  }
}
