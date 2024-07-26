import { Hono } from 'hono';
import { poweredBy } from 'hono/powered-by';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors'
import { addPostController, deletePostController, getPostController, getPostsController } from '../controller/PostController';
import { sendEmailsController, sendOtpController, verifyOtpController } from '../controller/SubscriptionController';
import { loginController, signupController } from '../controller/UserController';
import { authMiddleware } from '../middlewares/authMiddleware';
const app = new Hono();

app.use(poweredBy())
app.use(logger())
app.use('/api/*', cors())

/**
 * Request
 * {
 *  "title" : "Legend",
 *  "description": "What a legend!"
 * }
 */
app.post('/api/post', authMiddleware, addPostController);

/**
 * No Request
 */
app.delete('/api/post/:id', authMiddleware, deletePostController);

/**
 * No Request
 */
app.get('/api/post/:id', getPostController);

/**
 * No Request
 */
app.get('/api/posts', getPostsController)

/**
 * Request
 * {
 *  "subject": "New Post Alert",
 *  "message": "New post is there"
 * }
 */
app.post('/api/subscribe/sendEmails', sendEmailsController);

/**
 * Request
 * {
 *  "email": "hanzala.jucse@gmail.com"
 * }
 */
app.post('/api/subscribe/sendOtp', sendOtpController);

/**
 * Request
 * {
 *  "email": "hanzala.jucse@gmail.com",
 *  "otp": "1243"
 * }
 */
app.post('/api/subscribe/verifyOtp', verifyOtpController);

/**
 * Request
 * {
 *  "email": "hanzala.jucse@gmail.com",
 *  "password": "hanzal@12",
 *  "adminKey": "hanzala"
 * }
 */
app.post('/api/signup', signupController);

/**
 * Request
 * {
 *  "email": "hanzala.jucse@gmail.com",
 *  "password": "hanzal@12"
 * }
 */
app.post('/api/login', loginController);

export default app
