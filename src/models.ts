export enum UserRoles {
  USER = "user",
  ADMIN = "admin",
}


export interface Filter {
  page?: number
}

export interface AuthOpt{
  isOwner?:boolean
}


interface UserPayload {
  email: string;
  role: UserRoles
};

declare module 'jsonwebtoken' {
  interface JwtPayload {
    user: UserPayload
  }
}

declare module "express" {
  interface Request {
    cookies: {
      auth_tok?: string;
    };
    user: UserPayload;
    jti: string;
  }
}
