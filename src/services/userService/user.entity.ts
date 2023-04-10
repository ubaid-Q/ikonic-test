import { IsEmail, IsEmpty, IsEnum, IsNotEmpty, IsString, MinLength } from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserRoles } from "../../models"
import { Comment } from "../commentService/comment.entity"
import { Post } from "../postService/post.entity"

@Entity()
export class User {
    constructor(user: User) {
        this.firstName = user?.firstName
        this.lastName = user?.lastName
        this.email = user?.email
        this.password = user?.password
    }
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @IsNotEmpty()
    firstName: string

    @Column()
    @IsNotEmpty()
    lastName: string

    @Column({ unique: true })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string

    @Column()
    @IsEnum(UserRoles)
    role: UserRoles

    @Column()
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string

    @OneToMany(() => Post, post => post.user, { onDelete: "CASCADE" })
    posts: Post[];

    @OneToMany(() => Comment, comment => comment.user)
    comments: Comment[];
}
