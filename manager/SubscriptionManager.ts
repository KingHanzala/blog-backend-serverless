require('dotenv').config();
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function getSubscriber(email: string) {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const res = await prisma.subscriber.findFirst({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true
            },
        })
        return res;
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect()
    }
}

export async function validateOtp(email: string, otp:string) {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const res = await prisma.otp.findFirst({
            where: {
                email: email
            },
            select: {
                id: true,
                email: true,
                pin: true
            },
        })
        if(res && res.pin===otp) {
            return res;
        }
        return null;
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect()
    }
}

export async function deleteOtp(email: string) {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const res = await prisma.otp.deleteMany({
            where: {
                email: email
            }
        })
    } catch (err) {
        console.log(err);
    } finally {
        await prisma.$disconnect()
    }
}

export async function createOtp(email: string, otp: string) {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const existingOtp = await prisma.otp.findFirst({
            where: {
                email: email
            },
        });

        if (!existingOtp) {
            return await prisma.otp.create({
                data: {
                    email: email,
                    pin: otp
                },
                select: {
                    id: true,
                    email: true
                },
            })
        }
        return existingOtp;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        await prisma.$disconnect()
    }
}

export async function createSubscriber(email: string) {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const existingSubscriber = await prisma.subscriber.findFirst({
            where: {
                email: email
            },
        });

        if (!existingSubscriber) {
            return await prisma.subscriber.create({
                data: {
                    email: email
                },
                select: {
                    id: true,
                    email: true
                },
            })
        }
        return existingSubscriber;
    } catch (err) {
        console.log(err);
        return null;
    } finally {
        await prisma.$disconnect()
    }
}

export async function getAllSubscribers() {
    const prisma = new PrismaClient().$extends(withAccelerate());
    try {
        const res = await prisma.subscriber.findMany({
            select: {
                id: true,
                email:true
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

const emailHeader = `
  <div style="background-color:#084c53; padding: 15px; text-align: center;">
    <h1 style="color: #fff; margin: 0;">Airdrop Info</h1>
  </div>
`;

const emailFooter = `
  <div style="background-color:#084c53; padding: 15px; text-align: center;">
    <p style="color: #fff; margin: 0;">&copy; 2024 Airdrop Info. All rights reserved.</p>
    <p style="margin: 0;"><a href="https://airdropinfo.netlify.app" style="color: #FFD700;">Visit our website</a></p>
  </div>
`;

const generateEmailHtml = (bodyObject: string) => `
  <div style="background-color:#fff; border: 1px solid #ddd; max-width: 600px; margin: auto;">
    ${emailHeader}
    <div style="padding: 20px; font-family: Arial, sans-serif; color: #333; text-align: center;">
      ${bodyObject}
    </div>
    ${emailFooter}
  </div>
`;

export async function sendEmail(bodyObject: string, emailList: string[], subject: string) {
   
  }