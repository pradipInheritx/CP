
export const userWelcomeEmailTemplate = (userName: any, appLink: any) => {
  return `<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
  <title>Welcome to Coin Parliament</title>
  <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
     href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
     rel="stylesheet" />
  <!--[if mso]>
     <style>body,table,td { font-family: "Poppins", Arial, sans-serif; !important; }</style>
     <![endif]-->
  <style type="text/css">
     body {margin: 0 !important;padding: 0 !important;-webkit-text-size-adjust: 100% !important;-ms-text-size-adjust: 100% !important;-webkit-font-smoothing: antialiased !important;font-family: "Poppins", Arial, sans-serif !important;}
     img {border: 0 !important;outline: none !important;}
     p {Margin: 0px !important;Padding: 0px !important;}
     table {border-collapse: collapse;mso-table-lspace: 0px;mso-table-rspace: 0px;}
     td, a, span {border-collapse: collapse;mso-line-height-rule: exactly;}

     @media only screen and (max-width:600px) {
        .inx_wrapper {width: 100% !important;}
        .inx_side {padding-left: 15px !important;padding-right: 15px !important;}
        .inx_img {width: 100% !important;height: auto !important;max-width: 100% !important;}
        .inx_title {font-size: 18px !important;}
        .inx_f14 {font-size: 14px !important;line-height: 18px !important;}
        .inx_f12 {font-size: 12px !important;line-height: 16px !important;}
     }
  </style>
</head>

<body style="margin: 0px; padding: 0px; background: rgb(238, 238, 238);">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#eeeeee" style="background-color:#eeeeee;">

     <tr>
        <td align="center" valign="top">
           <table width="600" border="0" cellspacing="0" cellpadding="0" align="center" class="inx_wrapper"
              style="width:600px;" bgcolor="#feffff">

              <!-- Banner section starts -->
              <tr>
                 <td align="center" valign="top">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#2b186d">
                       <tr>
                          <td align="center" valign="bottom" style="padding: 40px 10px 0px 0px;">
                             <a href="#" target="_blank"
                                style="color:#000;text-decoration:none; display:inline-block;">
                                <img src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Fhpbanner.png?alt=media&token=d12b4d52-4b55-46e4-84be-de9ded2109c0" alt="Coin Parliament Vote To Earn" class="inx_img"
                                   width="600" height="184" border="0"
                                   style="display:block;font-family: 'Poppins', Arial, sans-serif;color:#ffffff;font-weight:bold;font-size:24px;max-width:600px;" />
                             </a>
                          </td>
                       </tr>
                    </table>
                 </td>
              </tr>
              <!-- Banner section ends -->

              <!-- Content section starts -->
              <tr>
                 <td align="center" valign="top" style="padding: 30px 20px 10px;">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                       <tr>
                          <td valign="top"
                             style="color: #2b186d;font-family: 'Poppins', Arial, sans-serif;font-size:20px;line-height: 26px;text-align: left;font-weight:bold;padding-bottom: 25px;"
                             class="inx_title">
                             Welcome to Coin Parliament – Unleash the Excitement of Web 3.0 Social Gaming!</td>
                       </tr>

                       <tr>
                          <td valign="top"
                             style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:16px;line-height: 20px;text-align: left;font-weight:500;padding-bottom: 15px;">
                             <strong>Dear ${userName},</strong>
                          </td>
                       </tr>

                       <tr>
                          <td valign="top"
                             style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 15px;">
                             Greetings and a warm welcome to Coin Parliament, the epicenter of Web 3.0 social
                             gaming! We are delighted to have you as part of our community, and we're here to
                             guide you through an immersive experience that goes beyond traditional gaming.
                          </td>
                       </tr>

                       <tr>
                          <td align="left" valign="top" style="padding-bottom: 20px;">
                             <table width="150" align="left" border="0" cellspacing="0" cellpadding="0"
                                style="background: #6352e8;">

                                <tr>
                                   <td height="38" valign="middle" class="red"
                                      style="color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size:14px; text-align: center; text-transform:uppercase;">
                                      <a href="${appLink}" target="_blank"
                                         style="text-decoration:none;color: #ffffff;display: block;line-height: 38px;">Vote
                                         Now!</a>
                                   </td>
                                </tr>

                             </table>
                          </td>
                       </tr>

                       <tr>
                          <td valign="top"
                             style="color: #2b186d;font-family: 'Poppins', Arial, sans-serif;font-size:16px;line-height: 26px;text-align: left;font-weight:bold;padding-bottom: 15px;">
                             What Awaits You at Coin Parliament:</td>
                       </tr>

                       <tr>
                          <td valign="top" style="padding-bottom: 20px;">
                             <table width="100%" border="0" cellspacing="0" cellpadding="0" align="left">
                                <tr>
                                   <td valign="top" style="padding-bottom: 10px;">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0" align="left">
                                         <tr>
                                            <td valign="top"
                                               style="font-size: 24px;font-weight: 700;line-height: 14px;padding-right: 10px;">
                                               .</td>
                                            <td valign="top"
                                               style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 0px;">
                                               Coin Mining Process (CMP): Dive into the CMP, mine PAX tokens, and
                                               witness
                                               the
                                               impact of your votes on the Social Voting Indicator (SVI).
                                            </td>
                                         </tr>
                                      </table>
                                   </td>
                                </tr>

                                <tr>
                                   <td valign="top" style="padding-bottom: 10px;">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0" align="left">
                                         <tr>
                                            <td valign="top"
                                               style="font-size: 24px;font-weight: 700;line-height: 14px;padding-right: 10px;">
                                               .</td>
                                            <td valign="top"
                                               style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 0px;">
                                               Exclusive Cards: Achieve 100 CMP to unlock exclusive cards, each
                                               adding a unique
                                               flair to your growing collection.
                                            </td>
                                         </tr>
                                      </table>
                                   </td>
                                </tr>

                                <tr>
                                   <td valign="top" style="padding-bottom: 10px;">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0" align="left">
                                         <tr>
                                            <td valign="top"
                                               style="font-size: 24px;font-weight: 700;line-height: 14px;padding-right: 10px;">
                                               .</td>
                                            <td valign="top"
                                               style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 0px;">
                                               Game Coins (VTE): Trade seamlessly within the app, using game
                                               coins to enhance your
                                               overall gaming and mining experience.
                                            </td>
                                         </tr>
                                      </table>
                                   </td>
                                </tr>

                                <tr>
                                   <td valign="top" style="padding-bottom: 10px;">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0" align="left">
                                         <tr>
                                            <td valign="top"
                                               style="font-size: 24px;font-weight: 700;line-height: 14px;padding-right: 10px;">
                                               .</td>
                                            <td valign="top"
                                               style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 0px;">
                                               Ambassador Program: Share the excitement with our Ambassador
                                               Program and unlock a
                                               lifetime of passive income.
                                            </td>
                                         </tr>
                                      </table>
                                   </td>
                                </tr>
                             </table>
                          </td>
                       </tr>

                       <tr>
                          <td valign="top" align="left" style="padding-bottom: 30px;">
                             <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center"
                                bgcolor="#f1f1f1">
                                <tr>
                                   <td valign="middle" align="center" style="padding: 20px;">
                                      <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center">
                                         <tr>
                                            <td valign="top"
                                               style="color: #2b186d;font-family: 'Poppins', Arial, sans-serif;font-size:16px;line-height: 26px;text-align: center;font-weight:bold;padding-bottom: 10px;"
                                               class="inx_f14">
                                               Ready to Begin the Adventure?</td>
                                         </tr>

                                         <tr>
                                            <td valign="top"
                                               style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: center;font-weight:400;padding-bottom: 15px;"
                                               class="inx_f12">
                                               Download the Coin Parliament app now and step into a world where
                                               social gaming meets
                                               the future!
                                            </td>
                                         </tr>

                                         <tr>
                                            <td align="center" valign="top" class="inx_side">
                                               <table width="150" align="center" border="0" cellspacing="0"
                                                  cellpadding="0" style="background: #6352e8;">

                                                  <tr>
                                                     <td height="38" valign="middle" class="red"
                                                        style="color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size:14px; text-align: center; text-transform:uppercase;">
                                                        <a href="${appLink}" target="_blank"
                                                           style="text-decoration:none;color: #ffffff;display: block;line-height: 38px;">Vote
                                                           Now!</a>
                                                     </td>
                                                  </tr>

                                               </table>
                                            </td>
                                         </tr>
                                      </table>
                                   </td>
                                </tr>
                             </table>
                          </td>
                       </tr>

                       <tr>
                          <td valign="top"
                             style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 15px;">
                             If you have any questions or need assistance along the way, our dedicated support
                             team is here to help.
                          </td>
                       </tr>

                       <tr>
                          <td valign="top"
                             style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 15px;">
                             Thank you for choosing Coin&nbsp;Parliament, where your journey in Web&nbsp;3.0
                             social gaming begins!
                          </td>
                       </tr>

                       <tr>
                          <td valign="top"
                             style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:12px;line-height: 20px;text-align: left;font-weight:400;padding-bottom: 15px;padding-top: 20px;">
                             Best regards,<br />
                             <span style="font-weight: 600;">Coin Parliament Support Team</span>
                          </td>
                       </tr>
                    </table>
                 </td>
              </tr>
              <!-- Content section ends -->

              <!-- Footer Section -->
              <tr>
                 <td align="center" valign="top">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#2b186d">

                       <tr>
                          <td valign="top" align="center" style="padding: 30px 15px 20px;">
                             <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                   <td align="center" valign="top" style="padding-bottom: 20px;">
                                      <table width="160" border="0" cellspacing="0" cellpadding="0" align="center">

                                         <tr>
                                            <td align="left" valign="middle" width="30" height="30">
                                               <a href="https://twitter.com/CoinParliament" target="_blank"
                                                  style="text-decoration:none; display:inline-block;"><img
                                                     src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Fx-twitter.svg?alt=media&token=ec2c54ad-3427-4422-ae6c-c59b5c6d1dac" alt="X Twitter" width="30" height="30"
                                                     border="0"
                                                     style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td align="left" valign="middle" width="30" height="30">
                                               <a href="https://www.facebook.com/CoinParliament/" target="_blank"
                                                  style="text-decoration:none; display:inline-block;"><img
                                                     src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Ffacebook.svg?alt=media&token=74bfc44b-37bc-479c-a060-24c42e02ce83" alt="facebook" width="30" height="30"
                                                     border="0"
                                                     style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td align="left" valign="middle" width="30" height="30">
                                               <a href="https://www.instagram.com/coinparliament/" target="_blank"
                                                  style="text-decoration:none; display:inline-block;"><img
                                                     src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Finstagram.svg?alt=media&token=eb740877-6439-4e42-a828-96ab978e8866" alt="instagram" width="30" height="30"
                                                     border="0"
                                                     style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                            </td>
                                            <td>&nbsp;</td>
                                            <td align="left" valign="middle" width="30" height="30">
                                               <a href="https://www.tiktok.com/@coinparliament" target="_blank"
                                                  style="text-decoration:none; display:inline-block;"><img
                                                     src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Ftiktok.svg?alt=media&token=c4e70d91-76d1-458d-b350-93e6b3fc377b" alt="tiktok" width="30" height="30"
                                                     border="0"
                                                     style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                            </td>
                                         </tr>

                                      </table>
                                   </td>
                                </tr>

                                <tr>
                                   <td valign="top"
                                      style="color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size:12px;line-height: 18px;text-align: center;font-weight:500;padding-bottom: 10px;">
                                      <a href="https://coinparliament.com/privacy" target="_blank"
                                         style="text-decoration: none;color: #c5bdff;">Privacy Policy</a> &nbsp;|
                                      &nbsp;<a href="https://coinparliament.com/terms-and-condition" target="_blank"
                                         style="text-decoration: none;color: #c5bdff;">Terms & Conditions</a>
                                   </td>
                                </tr>

                                <tr>
                                   <td valign="top"
                                      style="color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size:12px;line-height: 18px;text-align: center;font-weight:400;padding-bottom: 5px;">
                                      Copyright &copy; 2023 CoinParliament. All&nbsp;rights&nbsp;reserved.
                                   </td>
                                </tr>
                             </table>
                          </td>
                       </tr>

                    </table>
                 </td>
              </tr>
              <!-- Footer Section End -->

           </table>
        </td>
     </tr>

  </table>
</body>

</html>`
}
