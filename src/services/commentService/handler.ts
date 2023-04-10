import { validate } from "class-validator";
import { Request, Response } from "express";
import { PostService } from "../postService/service";
import { UserService } from "../userService/service";
import { Comment } from "./comment.entity";
import { CommentService } from "./service";

export class Comments {
  constructor(
    private commentService = new CommentService(),
    private postService = new PostService(),
    private userService = new UserService()
  ) {}

  async create(req: Request, res: Response) {
    try {
      let comment = new Comment(req.body);      
      const validator = await validate(comment);
      if (validator.length) {
        return res
          .status(400)
          .json({ message: "Validation Error", errors: validator });
      }
      const post = await this.postService.getById(comment.postId);
      if (!post) return res.status(404).json({ message: "Post not found." });

      comment.post = post;
      const user = await this.userService.getById(null, req.user.email);
      if (!user) return res.status(404).json({ message: "Post not found." });

      comment.user = user;
      delete comment.user.password;
      delete comment.user.role;
      const data = await this.commentService.create(comment);
      return res.status(201).json({ message: "Comment added", data });
    } catch (error) {
      return res.status(500).json({ message: "something went wrong." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const commentId = +req.params.id;
      const { content } = req.body;
      if (!commentId) {
        return res.status(404).json({ message: "Comment not found." });
      }
      const isComment = await this.commentService.getById(commentId);
      if (!isComment || isComment.user.email !== req.user.email) {
        return res.status(404).json({ message: "Comment not found." });
      }
      const result = await this.commentService.update(commentId, { content });
      if (result.affected) {
        return res.status(200).json({ message: "Updated Successfully.." });
      }
      return res.status(500).json({ message: "Maybe comment dosen't exists" });
    } catch (error) {
      return res.status(500).json({ message: "something went wrong." });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const commentId = +req.params.id;
      if (!commentId) {
        return res.status(404).json({ message: "Comment not found." });
      }
      const isComment = await this.commentService.getById(commentId);
      if (!isComment || isComment.user.email !== req.user.email) {
        return res.status(404).json({ message: "Comment not found." });
      }
      const result = await this.commentService.delete(commentId);
      if (result.affected) {
        return res.status(200).json({ message: "Deleted Successfully.." });
      }
    } catch (error) {
      return res.status(500).json({ message: "something went wrong." });
    }
  }
}
