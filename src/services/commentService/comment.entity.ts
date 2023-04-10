import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Post } from "../postService/post.entity";
import { User } from "../userService/user.entity";

@Entity()
export class Comment {
  constructor(comment: Comment) {
    this.content = comment?.content;
    this.postId = comment?.postId;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  content: string;

  @Column()
  @IsNotEmpty()
  @IsNumber()
  postId: number;

  @ManyToOne(() => Post, (post) => post.comments)
  post: Post;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
