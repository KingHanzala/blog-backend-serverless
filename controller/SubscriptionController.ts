import { Context } from "hono";
import { BlankEnv, BlankInput } from "hono/types";
import { createOtp, createSubscriber, deleteOtp, getAllSubscribers, getSubscriber, sendEmail, validateOtp } from "../manager/SubscriptionManager";

const emailBody = (message: string) => `
  <div style="padding: 20px; font-family: Arial, sans-serif; color: #333; background-color: #f4f4f9;">
    <div style="background-color: #FFFFFF; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
      <p style="font-size: 16px;">${message}</p>
    </div>
  </div>
`;

export const sendOtpController = async (c: any) => {
    const body = await c.req.json();
    const email: string = body['email'].toString();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const existingSubscriber = await getSubscriber(email);
    if (existingSubscriber) {
        return c.json({message: 'Subscriber already exists'}, 400);
    }
    try {
      await createOtp(email, otp);
      const bodyObject = `<p>Your OTP is: <strong>${otp}</strong></p>`;
      await sendEmail(bodyObject, [email], 'Your OTP for Airdrop Info Subscription');
      return c.json({ success: true, message: 'OTP sent successfully.' }, 200);
    } catch (error) {
      console.error('Error sending OTP:', error);
      return c.json({ success: false, message: 'Error sending OTP.' }, 500);
    }
  };

  export const verifyOtpController = async (c: Context<BlankEnv, "/api/subscribe/verifyOtp", BlankInput>) => {
    const body = await c.req.json();
    const email: string = body['email'].toString();
    const otp: string = body['otp'].toString();
    try {
      const validOtp = validateOtp(email,otp);
      if (!validOtp) {
        return c.json({ success: false, message: 'Invalid OTP.' }, 400);
      }
  
      createSubscriber(email);
      const bodyObject = `<p>Your subscription is successful. Exciting days ahead!</strong></p>`;
      await sendEmail(bodyObject, [email], 'Airdrop Info: Subscribed Successfully');
      await deleteOtp(email); // Clear OTPs for the email after successful verification
  
      return c.json({ success: true, message: 'Subscription successful.' }, 200);
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return c.json({ success: false, message: 'Error verifying OTP.' }, 500);
    }
  };


  export const sendEmailsController = async (c: Context<BlankEnv, "/api/subscribe/sendEmails", BlankInput>) => {
    const body = await c.req.json();
    const subject: string = body['subject'].toString();
    const message: string = body['message'].toString();
    try {
        const subscribers = await getAllSubscribers();
        if(subscribers){
            const emailList = subscribers.map(sub=> sub.email);
            if(emailList) await sendEmail(emailBody(message), emailList, subject);
        }
        return c.json({ message: 'Emails sent successfully' }, 200);
    } catch (error) {
        return c.json({ error: 'Failed to send emails' }, 500);
    }
};
  