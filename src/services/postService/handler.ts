import { hash } from "bcrypt";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { envConfig } from "../../config/envConfig";
import { UserService } from "../userService/service";
import { Post } from "./post.entity";
import { PostService } from "./service";

export class Posts {
  constructor(
    private postService = new PostService(),
    private userService = new UserService()
  ) {}

  async get(req: Request, res: Response) {
    try {
      const id = +req.params.id;
      const page = req.query.page ? +req.query.page : 1;
      if (id) {
        const post = await this.postService.getById(id);
        return res.status(200).json({ data: post });
      }
      const posts = await this.postService.get({ page });
      return res.status(200).json({ data: posts });
    } catch (error) {
      return res.status(500).json({ message: "something went wrong." });
    }
  }

  async getByUser(req: Request, res: Response) {
    try {
      const page = req.query.page ? +req.query.page : 1;
      const posts = await this.postService.getByUser(req.user.email, { page });
      return res.status(200).json({ data: posts });
    } catch (error) {}
  }

  async create(req: Request, res: Response) {
    try {
      if (req.file) {
        req.body.image = envConfig.APP.url + "/" + req.file.filename;
      }
      const post = new Post(req.body);
      const validator = await validate(post);
      if (validator.length) {
        return res.status(400).json({ message: "Validation Error", errors: validator });
      }
      const user = await this.userService.getById(null, req.user.email);
      delete user.password;
      delete user.role;
      post.user = user;
      const data = await this.postService.create(post);
      if (data) {
        return res.status(201).json({ message: "Created...", data });
      }
    } catch (error) {
      return res.status(500).json({ message: "something went wrong." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const postId = +req.params.id;
      const { title, content } = req.body;
      if (!postId) {
        return res.status(404).json({ message: "Post not found." });
      }
      const isPost = await this.postService.getById(postId);
      if (!isPost || isPost.user.email !== req.user.email) {
        return res.status(404).json({ message: "Post not found." });
      }
      const result = await this.postService.update(postId, { title, content });
      if (result.affected) {
        return res.status(200).json({ message: "Updated Successfully.." });
      }
      return res.status(500).json({ message: "Maybe post dosen't exists" });
    } catch (error) {
      return res.status(500).json({ message: "something went wrong." });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const postId = +req.params.id;
      if (!postId) {
        return res.status(404).json({ message: "Post not found." });
      }
      const isPost = await this.postService.getById(postId);
      if (!isPost || isPost.user.email !== req.user.email) {
        return res.status(404).json({ message: "Post not found." });
      }
      const result = await this.postService.delete(postId);
      if (result.affected) {
        return res.status(200).json({ message: "Deleted Successfully.." });
      }
    } catch (error) {
      return res.status(500).json({ message: "something went wrong." });
    }
  }
}
