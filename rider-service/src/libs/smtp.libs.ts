import nodemailer from 'nodemailer'
import { getEnvValue } from "../utils/getEnv"
import { uberLogger } from './common.logger';

export const sendEmail = async (
    to: string,
    subject: string,
    text: string,
    html: any
  ) => {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 456,
      secure: true,
      auth: {
        user: getEnvValue('APP_EMAIL'),
        pass: getEnvValue('APP_PASSWORD'),
      },
    });
  
    let methodOptions: string | undefined | {} = {
      from: {
        name: "Uber Microservices",
        address: getEnvValue('APP_EMAIL'),
      },
      to,
      subject,
      text,
      html,
    };
  
    return transporter
      .sendMail(methodOptions)
      .then((res) => {
       uberLogger.info(res)
      })
      .catch((err) => {
        uberLogger.error(err)
      });
  };