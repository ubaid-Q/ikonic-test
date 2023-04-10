import { hash } from "bcrypt";
import { IsEmail, validate } from "class-validator";
import { Request, Response } from "express";
import { UserService } from "./service";
import { User } from "./user.entity";

export class Users {
  constructor(private userService = new UserService()) {}

  async get(req: Request, res: Response) {
    try {
      const id = +req.params.id;
      const page = req.query.page ? +req.query.page : 1;

      if (id) {
        const user = await this.userService.getById(id);
        return res.status(200).json({ data: user });
      }
      const users = await this.userService.get({ page });
      return res.status(200).json({ data: users });
    } catch (error) {
      return res.status(500).json({ message: "something went wrong." });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = +req.params.id;
      const { email, password } = req.body;
      if (!id) {
        return res.status(404).json({ message: "User not found." });
      }
      if (!IsEmail(email)) {
        return res.status(400).json({ message: "Invalid Email." });
      }
      const isExists = await this.userService.getById(null, email);
      if (isExists) {
        return res.status(409).json({ message: "Email already in use." });
      }
      if (password) {
        var hashedPassword = await hash(password, 10);
      }
      const result = await this.userService.update(id, {
        email,
        password: hashedPassword,
      });

      if (result.affected) {
        return res.status(200).json({ message: "Updated Successfully.." });
      }
      return res.status(500).json({ message: "Maybe user dosen't exists" });
    } catch (error) {
      return res.status(500).json({ message: "something went wrong." });
    }
  }

  async remove(req: Request, res: Response) {
    try {
      const id = +req.params.id;
      if (id) {
        const user = await this.userService.delete(id);
        if (user.affected)
          return res.status(200).json({
            message: "Account and it's all data is deleted successfully..",
          });
      }
      return res.status(400).json({ message: "User not found." });
    } catch (error) {
      return res.status(500).json({ message: "something went wrong." });
    }
  }

  async me(req: Request, res: Response) {
    const user = await this.userService.getById(null, req.user.email);
    delete user.password
    delete user.role
    return res.status(200).json({ data: user });
  }
}
