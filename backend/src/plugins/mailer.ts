import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import nodemailer from 'nodemailer';

declare module 'fastify' {
  interface FastifyInstance {
    sendMail: (emailData: EmailData) => Promise<void>;
  }
}

type EmailData = { email: string; subject: string; message: string };

const mailerPlugin: FastifyPluginAsync = fp(async (fastify) => {
  const { config } = fastify;

  const transporter = nodemailer.createTransport({
    host: config.EMAIL_HOST,
    port: config.EMAIL_PORT,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
  });

  const sendMail = async ({ email, subject, message }: EmailData) => {
    try {
      await transporter.sendMail({
        from: 'no_reply@quirely.io', // TODO: to change
        to: email,
        subject: subject,
        html: message,
      });
      fastify.log.info(`email to ${email} sent succesfully`);
    } catch (error) {
      fastify.log.error(error, `email to ${email} not sent`);
    }
  };

  fastify.decorate('sendMail', sendMail);
});

export default mailerPlugin;
