/* eslint-disable consistent-return */
/* eslint-disable prefer-promise-reject-errors */
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';

import models from '../models';

const { user } = models;

export function signJsonWebToken(usr) {
  const token = jwt.sign({
    data: usr,
  }, process.env.JWT_SECRET);
  return token;
}

export function getErrorMessage(error) {
  console.log(error);
  const message = error.errors[0];
  return {
    [message.path]: error.original.message,
  };
}

export function sendEmail({ recipientEmail }) {
  return new Promise((resolve, reject) => {
    user.findOne({
      where: { email: recipientEmail },
    }).then((responseData) => {
      if (responseData) {
        const transporter = nodemailer.createTransport({
          host: 'sandbox.smtp.mailtrap.io',
          port: 2525,
          auth: {
            user: process.env.MAILTRAP_USER,
            pass: process.env.MAILTRAP_PASSWORD,
          },
        });

        const email = {
          body: {
            name: responseData.firstName,
            intro: 'Delic password reset',
            action: {
              instructions: 'We’ve received your request to reset your password. Please click the link below to complete the reset.',
              button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: `http://localhost:3000/resetPassword?recoveryPasswordId=${responseData.recoveryPasswordId}`,
              },
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
          },
        };

        const MailGenerator = new Mailgen({
          theme: 'default',
          product: {
            name: 'Delic Team',
            link: 'https://mailgen.js/',
          },
        });

        const emailBody = MailGenerator.generate(email);

        const mailOptions = {
          from: process.env.APP_EMAIL,
          to: recipientEmail,
          subject: 'Delic Team',
          html: emailBody,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return reject({ message: 'Error sending email' });
          }
          console.log(`Email sent: ${info.response}`);
          return resolve({ message: 'Email sent successfully' });
        });
      } else {
        return reject({ message: 'User not found' });
      }
    });
  });
}
