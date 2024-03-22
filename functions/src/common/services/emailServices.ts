
// import env from "../../env/env.json";
// import sgMail from "@sendgrid/mail";

// export async function sendEmail(to: any, subject: any, body: any): Promise<{ status: boolean; message: string; result?: any }> {
//   try {
//     console.log("email>>>>>>>>");

//     sgMail.setApiKey(env.sendgrid_api_key);
//     console.log("API Key IS", env.sendgrid_api_key)
//     const msg = {
//       to,
//       from: "akashpatel.inheritx@gmail.com",
//       subject,
//       html: body,
//     };
//     const response = await sgMail.send(msg);

//     console.log("RESPONSE EMAIL==>", response);

//     console.log("Email sent");

//     return {
//       status: true,
//       message: "Email sent successfully",
//     };
//   } catch (error: any) {
//     console.error("Error sending email:", error.message);
//     return {
//       status: false,
//       message: error.message,
//       result: null
//     };
//   }
// }

import nodemailer from "nodemailer"


// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email",
//   port: 587,
//   secure: false,
//   auth: {
//     user: "feni.p@inheritx.com",
//     pass: "",
//   },
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
      user: 'feni.p@inheritx.com',
      pass: 'cLN9yIzhY!ifhLz'
  }
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendEmail(to:any, subject:any, htmlCode:any) {
  // send mail with defined transport object
  console.log("email>>>>>>", {
    from: "feni.p@inheritx.com", // sender address
    to, // "bar@example.com, baz@example.com", // list of receivers
    subject, // Subject line
    html: htmlCode
  });
  const info = await transporter.sendMail({
    from: "feni.p@inheritx.com", // sender address
    to, // "bar@example.com, baz@example.com", // list of receivers
    subject, // Subject line
    html: htmlCode
  });

  console.log("Message sent: %s",to, info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// sendemail("none","welcome",adminsignuptemplate("olen.konopelski50@ethereal.email","pass",'title')).catch(console.error);