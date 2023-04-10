import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, verify } from "jsonwebtoken";
import { publicKey } from "../config/keys";
import { isTokenRevoked } from "../config/tokensConfig";
import { AppDataSource } from "../data-source";
import { AuthOpt, UserRoles } from "../models";
import { User } from "../services/userService/user.entity";

/**
 * Validate request and check for authentication token
 * @param req 
 * @param res 
 */
export function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.signedCookies.auth_tok
        if (!token) {
            return res.status(401).json({ message: 'Unauthenticated Request.' })
        }        
        const payload = verify(token, publicKey)
        
        if (typeof payload == 'object' && isTokenRevoked(payload.jti)) {
            return res.status(401).json({ message: 'Revoked Request.' })
        }
        if (typeof payload == 'object') {
            req.user = payload.user
            req.jti = payload.jti
            next()
        }
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            return res.status(401).json({ message: error.message, error: 'authentication_error' })
        }
        return res.status(500).json({ message: 'Something went wrong...', error: error.message })
    }

}


/**
 * Check for authorization by provided role 
 * @param role Role to check for authorization
 * @param isOwner If true then check for resource ownership
 * @returns 
 */
export function isAuthorized(role: UserRoles, options?: AuthOpt) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (options?.isOwner) {
                const resourceId = +req.params.id;
                const userRepo = AppDataSource.getRepository(User)
                const isUser = await userRepo.findOneBy({ email: req.user.email })
                if (isUser.id === resourceId) {
                    return next()
                }
            }

            if (req.user.role !== role) {
                return res.status(401).json({ message: "Unauthorized access!" })
            }
            return next()
        } catch (error) {
            return res.status(401).json({ message: "authentication error.", error })
        }
    }
}