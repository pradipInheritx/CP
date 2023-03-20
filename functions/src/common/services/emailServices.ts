import env from "../../env/env.json";
import sgMail from "@sendgrid/mail";

export async function sendEmail(to:any, subject:any, body:any) {
  console.log("email>>>>>>>>");

  sgMail.setApiKey(env.sendgrid_api_key);
  const msg = {
    to,
    from: "akashpatel.inheritx@gmail.com",
    subject,
    html: body,
  };
  const response = await sgMail.send(msg);

  console.log("RESPONSE EMAIL==>", response);

  console.log("Email sent");
}
