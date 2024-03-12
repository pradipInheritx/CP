const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "olen.konopelski50@ethereal.email",
    pass: "tN439bWEeED5WvA7gz",
  },
});

// async..await is not allowed in global scope, must use a wrapper
export async function sendBulkEmail(to: any, subject: any, htmlCode: any) {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: "faizal.b@inheritx.com", // sender address
    to, // "bar@example.com, baz@example.com", // list of receivers
    subject, // Subject line
    html: htmlCode,
  });

  console.log("Message sent: %s", to, info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

// sendEmail("none","welcome",adminSignupTemplate("olen.konopelski50@ethereal.email","pass",'title')).catch(console.error);
