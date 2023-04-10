import { IsNotEmpty } from "class-validator";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  RelationId,
  CreateDateColumn,
} from "typeorm";
import { Comment } from "../commentService/comment.entity";
import { User } from "../userService/user.entity";

@Entity()
export class Post {
  constructor(post: Post) {
    this.title = post?.title;
    this.content = post?.content;
    this.image = post?.image
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  title: string;

  @Column()
  @IsNotEmpty()
  content: string;

  @Column({ default: null })
  @IsNotEmpty()
  image: string;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, { onDelete: "CASCADE" })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;
}
