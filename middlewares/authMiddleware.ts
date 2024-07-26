import { MiddlewareHandler } from "hono";
import {verify} from "hono/jwt";
import { env } from 'hono/adapter'

export const authMiddleware: MiddlewareHandler= async(c, next) => {
    const token = c.req.header('Authorization');
    if (token) {
    const authToken = token?.replace('Bearer ','');
    const {JWT_SECRET} = env<{JWT_SECRET: string}>(c)
      const res = await verify(authToken, JWT_SECRET,'HS256');
      if(res) {
        await next();
      } else {
        return c.json({message : "You are not an admin"}, 401);
      }
    }
  };