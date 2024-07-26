import { env } from 'hono/adapter'
import { Context } from "hono";
import { sign, verify } from 'hono/jwt';
import * as jwt from "jsonwebtoken";
import { createAdmin, getAdmin } from "../manager/UserManager";

export const signupController =  async (c: Context) => {
  const body = await c.req.json();
  const email = body['email'];
  const password = body['password'];
  const adminKey = body['adminKey'];

  const existingUser = await getAdmin(email);

  if (existingUser) {
    return c.json({ message: 'User already exists' }, 400);
  }
  console.log(adminKey);
  const {ADMIN_SECRET} = env<{ADMIN_SECRET: string}>(c)
  console.log(ADMIN_SECRET);
  if (adminKey !== ADMIN_SECRET) {
    return c.json({ message: 'Invalid secret to be made an admin' }, 401);
  }

  const id = await createAdmin(email, password);
  
  const {JWT_SECRET} = env<{JWT_SECRET: string}>(c)
  const token = await sign({ sub: id, exp: Math.floor(Date.now() / 1000) + 60 * 60,}, JWT_SECRET, 'HS256');

  return c.json({ token }, 201);
}

export const loginController =  async (c: Context) => {
  const body = await c.req.json();
  const email = body['email'];
  const password = body['password'];
  const user = await getAdmin(email);

  const {JWT_SECRET} = env<{JWT_SECRET: string}>(c)

  if (user && (password===user.password) ) {
    const token = await sign({ sub: user.id, exp: Math.floor(Date.now() / 1000) + 60 * 60, }, JWT_SECRET, 'HS256');
    return c.json({ token }, 201);
  } else {
    return c.json({ message: 'Invalid credentials' }, 401);
  }
}
