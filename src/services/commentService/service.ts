import { AppDataSource } from "../../data-source";
import { Comment } from "./comment.entity";

export class CommentService {
    constructor(private commentRepository = AppDataSource.getRepository(Comment)) { }

    getById(id:number){
        return this.commentRepository.findOne({
            where:{id},
            relations:['user']
        })
    }

    create(data: Comment) {
        return this.commentRepository.save(data);
    }

    update(id: number, data) {
        return this.commentRepository.update({ id }, data);
    }

    delete(id: number) {
        return this.commentRepository.delete({ id });
    }
}
