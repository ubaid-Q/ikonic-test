import { Router } from "express";
import { AuthMiddleware, isAuthorized } from "../../middlewares/auth.middleware";
import { UserRoles } from "../../models";
import { Comments } from "./handler";

const comments = new Comments();
const { remove, update, create } = comments;

export const commentRouter = Router();
commentRouter.use(AuthMiddleware);

commentRouter.post("/", create.bind(comments));
commentRouter.patch("/:id", isAuthorized(UserRoles.USER, { isOwner: true }), update.bind(comments));
commentRouter.delete("/:id",isAuthorized(UserRoles.USER, { isOwner: true }), remove.bind(comments));
