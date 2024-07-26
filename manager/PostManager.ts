import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export async function deletePost(id: number) {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const res = await prisma.posts.update({
            where: {
                id: id
            },
            data: {
                isDeleted: true,
            },
            select: {
                title: true,
                isDeleted: true
            }
        })
        return res
    } catch (err) {
        console.log(err)
        return null;
    } finally {
        await prisma.$disconnect()
    }
}
  
export async function addPost(title: string, description: string, image: string, links: string[]) {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const existingPost = await prisma.posts.findFirst({
            where: {
                title: title,
                isDeleted: false,
            },
        });

        if (!existingPost) {
            return await prisma.posts.create({
                data: {
                    title,
                    description,
                    image,
                    links
                },
                select: {
                    id: true,
                    title: true
                },
            })
        }
        console.log("Post with same title already exists");
        return null;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        await prisma.$disconnect()
    }
}
  
export async function getPost(id: number) {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const res = await prisma.posts.findFirst({
            where: {
                id: id,
                isDeleted: false
            },
            select: {
                id: true,
                title: true,
                description: true,
                image: true,
                links: true
            },
        })
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect()
    }
}

export async function getPosts() {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const res = await prisma.posts.findMany({
            where: {
                isDeleted: false
            },
            select: {
                id: true,
                title: true,
                description: true,
                image: true,
                links: true
            },
        })
        console.log(res);
        return res;
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect()
    }
}

