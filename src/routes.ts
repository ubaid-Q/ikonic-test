import { Router } from "express";
import { authRouter } from "./services/authService/routes";
import { commentRouter } from "./services/commentService/routes";
import { postRouter } from "./services/postService/routes";
import { userRouter } from "./services/userService/routes";

export const apiRouter  = Router()

apiRouter.use('/auth',authRouter)
apiRouter.use('/user',userRouter)
apiRouter.use('/post',postRouter)
apiRouter.use('/comment',commentRouter)