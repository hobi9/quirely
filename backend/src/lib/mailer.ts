import nodemailer from 'nodemailer';
import { logger } from './logger';

export const mailer = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

type EmailData = { receiverEmail: string; subject: string; html?: string; text?: string };

export const sendMail = async ({ receiverEmail: email, subject, html, text }: EmailData) => {
  try {
    await mailer.sendMail({
      from: 'no_reply@quirely.io', // TODO: to change
      to: email,
      subject,
      html,
      text,
    });
    logger.info(`email to ${email} sent succesfully`);
  } catch (error) {
    logger.error(error, `email to ${email} not sent`);
  }
};
