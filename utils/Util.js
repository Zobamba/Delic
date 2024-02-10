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
  }, process.env.JWT_SECRET, { expiresIn: '6h' });
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
          // host: '127.0.0.1',
          // port: 1025,
          service: 'gmail',
          auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASSWORD,
          },
        });

        const email = {
          body: {
            name: responseData.firstName,
            intro: 'We’ve received your request to reset your password.',
            action: {
              instructions: 'Please click the link below to complete the reset.',
              button: {
                color: '#1da1f2', // Optional action button color
                text: 'Confirm your account',
                link: `https://delic-admin.netlify.app/resetPassword?recoveryPasswordId=${responseData.recoveryPasswordId}`,
                // link: `http://localhost:3000/resetPassword?recoveryPasswordId=${responseData.recoveryPasswordId}`,
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
          from: '"Delic" <custom@example.com>',
          to: recipientEmail,
          subject: '[Delic] Reset your password',
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

export function sendSignUpEmail({ firstName, recipientEmail }) {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_PASSWORD,
      },
    });

    const email = {
      body: {
        name: firstName,
        intro: 'We are delighted to have you on board. With Delic admin, you get effortless order management, dynamic menu customization, and real-time analytics - all in one platform!.',
        action: {
          instructions: 'Use the link below to sign into your delic admin account',
          button: {
            color: '#1da1f2', // Optional action button color
            text: 'Login',
            link: 'https://delic-admin.netlify.app/sign-in',
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
      from: '"Delic" <custom@example.com>',
      to: recipientEmail,
      subject: '[Delic] Sign up successful',
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
  });
}

export function sendLoginEmail({ recipientEmail }) {
  return new Promise((resolve, reject) => {
    user.findOne({
      where: { email: recipientEmail },
    }).then((responseData) => {
      if (responseData) {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.MY_EMAIL,
            pass: process.env.MY_PASSWORD,
          },
        });

        const email = {
          body: {
            name: responseData.firstName,
            intro: `A new sign in was noticed on your Delic account. Please review the details below to confirm it was you.
            Date & time of login: ${new Date()}.`,
            action: {
              instructions: 'If this was you, no action is required, If this wasn’t you, follow the link to secure the account.',
              button: {
                color: '#1da1f2', // Optional action button color
                text: 'Change your password now',
                link: 'https://delic-admin.netlify.app/emailVerification',
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
          from: '"Delic" <custom@example.com>',
          to: recipientEmail,
          subject: '[Delic] New login to Delic',
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
