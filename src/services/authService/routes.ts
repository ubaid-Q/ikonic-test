import { Router } from "express";
import { AuthMiddleware } from "../../middlewares/auth.middleware";
import { Auth } from "./handler";

const auth = new Auth()
const { register, login, logout } = auth
export const authRouter = Router()

authRouter.post('/register', register.bind(auth))
authRouter.post('/login', login.bind(auth))
authRouter.delete('/logout', AuthMiddleware, logout.bind(auth))

