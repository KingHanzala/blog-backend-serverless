import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function getAdmin(email: string){
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const res = await prisma.admin.findFirst({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                password: true
            },
        });
        return res;

    } catch (err) {
        console.log(err);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export async function createAdmin(email: string, password: string) {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const existingAdmin = await prisma.admin.findFirst({
            where: {
                email: email
            },
        });

        if (!existingAdmin) {
            return await prisma.admin.create({
                data: {
                    email: String(email),
                    password: password
                },
                select: {
                    id: true,
                    email: true
                },
            })
        }
        console.log("Admin with same email already exists");
        return null;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        await prisma.$disconnect()
    }
}