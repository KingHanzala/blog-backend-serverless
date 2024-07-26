import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { addPost, deletePost, getPost, getPosts } from "../manager/PostManager";

export const addPostController = async (c: Context<BlankEnv, "/api/post", BlankInput>) => {
    try {
        const body = await c.req.json();
        const title: string = body['title'].toString()
        const description: string = body['description'].toString()
        const image: string = body['image'].toString()
        const links: string[] = body['links']
        const res = await addPost(title, description, image, links);
        console.log(res)
        if (res) {
            return c.json({ message: 'Post was created successfully' }, 200);
        } else {
            return c.json({ message: 'Post was not created' }, 401)
        }
    } catch (err) {
        console.error(err);
        return c.json({ error: 'Database query failed' }, 500);
    }

}

export const getPostController = async (c: Context<BlankEnv, "/api/post", BlankInput>) => {
    const id = await c.req.param('id');
    try {
        const post = await getPost(Number(id));
        if (!post) {
            return c.json({ error: 'Post not found' }, 404);
        }
        return c.json(post, 200);
    } catch (err) {
        return c.json((err as any)?.message || { error: "Internal Server Error" }, 500);
    }
}

export const getPostsController = async (c: Context<BlankEnv, "/api/posts", BlankInput>) => {
    try {
        const posts = await getPosts();
        if (!posts) {
            return c.json({ error: 'There are no posts available' }, 404);
        }
        return c.json(posts, 200);
    } catch (err) {
        return c.json((err as any)?.message || { error: "Internal Server Error" }, 500);
    }
}

export const deletePostController = async (c: Context<BlankEnv, "/api/post", BlankInput>) => {
    const id = await c.req.param('id');
    try {
        const post = await deletePost(Number(id));
        if (!post) {
            return c.json({ error: 'Post not found' }, 404);
        }
        return c.json({ message: 'Post was deleted successfully' }, 200);
    } catch (err) {
        return c.json((err as any)?.message || { error: "Internal Server Error" }, 500);
    }
}