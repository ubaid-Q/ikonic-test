import { Request, Response } from "express";
import { UserService } from "../userService/service";
import { User } from "../userService/user.entity";
import { isEmail, validate } from "class-validator";
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { UserRoles } from "../../models";
import { privateKey } from "../../config/keys";
import { randomUUID } from "crypto";
import { revokeToken } from "../../config/tokensConfig";

export class Auth {
    constructor(private userService = new UserService()) { }

    
    /**
     * Register a user
     * @param req 
     * @param res 
     * @returns User data and authentication token
     */
    async register(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            let user = new User(req.body)
            user.role = UserRoles.USER
            const validator = await validate(user)
            if (validator.length) {
                return res.status(400).json({ message: "Validation Eroor", errors: validator });
            }
            const isExists = await this.userService.getById(null, user.email)
            if (isExists) {
                return res.status(409).json({ message: "User already exists with this email" })
            }
            user.password = await hash(user.password, 10)
            const payload = {
                user: {
                    email: user.email,
                    role: user.role,
                },
                jti: randomUUID()
            }
            const token = sign(payload, privateKey, {
                expiresIn: '1h',
                encoding: "UTF-8",
                header: { alg: "RS256" }
            })
            res.cookie('auth_tok', token, {
                httpOnly: true,
                secure: true,
                signed: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000
            });
            const data = await this.userService.create(user);
            delete data.password
            delete data.role
            return res.status(201).json({ message: "Register Successfully!", data });
        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }

    /**
     * Validates a user credentials if true then generate a auth token
     * @param req 
     * @param res 
     * @returns authentication token
     */
    async login(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email / Password is required." })
            }

            if (!isEmail(email)) return res.status(400).json({ message: "Email is not valid." })

            const user = await this.userService.getById(null, email);
            if (!user) return res.status(404).json({ message: "User dosen't exists." })
            
            const isValidPassword = await compare(password, user.password);
            if (!isValidPassword) {
                return res.status(400).json({ message: "Invalid email or password." })
            }
            const payload = {
                user: {
                    email: user.email,
                    role: user.role,
                },
                jti: randomUUID()
            }
            const token = sign(payload, privateKey, {
                expiresIn: '1h',
                encoding: "UTF-8",
                header: { alg: "RS256" }
            })
            delete user.password
            delete user.role
            res.cookie('auth_tok', token, {
                httpOnly: true,
                secure: true,
                signed: true,
                sameSite: "strict",
                maxAge: 60 * 60 * 1000
            });
            return res.status(200).json({ message: "LoggedIn Successfully!", data: user })

        } catch (error) {
            return res.status(500).json({ message: error.message })
        }
    }


    /**
     * Logout a user and revoke the authentication token
     * @param req 
     * @param res 
     */
    async logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>> {
        res.clearCookie("auth_tok")
        revokeToken(req.jti, 60 * 60 * 1000)
        return res.status(200).json({ message: "Logout Successfully!" })

    }
}
