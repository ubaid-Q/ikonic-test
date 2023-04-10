import { Router } from "express";
import { AuthMiddleware, isAuthorized } from "../../middlewares/auth.middleware";
import { UserRoles } from "../../models";
import { Users } from "./handler";

const users = new Users()
const { get, remove, update,me } = users;

export const userRouter = Router()
userRouter.use(AuthMiddleware)

userRouter.get('/me',me.bind(users))
userRouter.get('/', isAuthorized(UserRoles.ADMIN), get.bind(users))
userRouter.get('/:id', isAuthorized(UserRoles.ADMIN), get.bind(users))
userRouter.patch('/:id', isAuthorized(UserRoles.ADMIN, { isOwner: true }), update.bind(users))
userRouter.delete('/:id', isAuthorized(UserRoles.ADMIN, { isOwner: true }), remove.bind(users))