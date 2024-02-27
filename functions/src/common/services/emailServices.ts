import env from "../../env/env.json";
import sgMail from "@sendgrid/mail";

export async function sendEmail(to: any, subject: any, body: any): Promise<{ status: boolean; message: string; result?: any }> {
  try {
    console.log("email>>>>>>>>");

    sgMail.setApiKey(env.sendgrid_api_key);
    const msg = {
      to,
      from: "support@votingparliament.com",
      subject,
      html: body,
    };
    const response = await sgMail.send(msg);

    console.log("RESPONSE EMAIL==>", response);

    console.log("Email sent");

    return {
      status: true,
      message: "Email sent successfully",
    };
  } catch (error:any) {
    console.error("Error sending email:", error.message);
    return {
      status: false,
      message: error.message,
      result: null
    };
  }
}
