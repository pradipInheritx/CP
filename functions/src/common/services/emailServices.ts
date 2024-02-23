
import env from "../../env/env.json";
import sgMail from "@sendgrid/mail";

export async function sendEmail(to: any, subject: any, body: any) {
  try {
    console.log("email>>>>>>>>");

    sgMail.setApiKey(env.sendgrid_api_key);
    const msg = {
      to,
      from: "support@votetoearn.net",
      subject,
      html: body,
    };
    const response = await sgMail.send(msg);

    console.log("RESPONSE EMAIL==>", response);

    console.log("Email sent");
  } catch (error:unknown) {
    if (error instanceof Error ){
      console.error("Error sending email:", error.message);
      throw new Error("Failed to send email");
    }
    
  }
}

