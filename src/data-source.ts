import "reflect-metadata"
import { DataSource, } from "typeorm"
import { envConfig } from "./config/envConfig"
import { Comment } from "./services/commentService/comment.entity"
import { Post } from "./services/postService/post.entity"
import { User } from "./services/userService/user.entity"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: envConfig.DB.host,
    port: +envConfig.DB.port,
    username: envConfig.DB.user,
    password: envConfig.DB.password,
    database: envConfig.DB.name,
    synchronize: true,
    logging: false,
    entities: [User,Post,Comment],
    migrations: [],
    subscribers: [],
})
