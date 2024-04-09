
export const userWelcomeEmailTemplate = (displayName: any, appLink: any) => {
   return `
   <!DOCTYPE html
   PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
   xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
   <title>Welcome to VoteToEarn – Start Voting and Earning!</title>
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
      body {
         margin: 0 !important;
         padding: 0 !important;
         -webkit-text-size-adjust: 100% !important;
         -ms-text-size-adjust: 100% !important;
         -webkit-font-smoothing: antialiased !important;
         font-family: "Poppins", Arial, sans-serif !important;
      }

      img {
         border: 0 !important;
         outline: none !important;
      }

      p {
         Margin: 0px !important;
         Padding: 0px !important;
      }

      table {
         border-collapse: collapse;
         mso-table-lspace: 0px;
         mso-table-rspace: 0px;
      }

      td,
      a,
      span {
         border-collapse: collapse;
         mso-line-height-rule: exactly;
      }

      .btn_site:hover {
         background-color: #0057E1 !important;
         border-color: #0057E1 !important;
      }

      @media only screen and (max-width:600px) {
         .inx_wrapper {
            width: 100% !important;
         }

         .inx_side {
            padding-left: 15px !important;
            padding-right: 15px !important;
         }

         .inx_img {
            width: 100% !important;
            height: auto !important;
            max-width: 100% !important;
         }

         .inx_telegram_btn {
            width: 170px !important;
            height: auto !important;
            max-width: 100% !important;
         }

         .inx_title {
            font-size: 18px !important;
         }

         .inx_f14 {
            font-size: 14px !important;
            line-height: 18px !important;
         }

         .inx_f12 {
            font-size: 12px !important;
            line-height: 16px !important;
         }

         .btn_site:hover {
            background-color: #0057E1 !important;
            border-color: #0057E1 !important;
         }
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
                     <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" bgcolor="#0057E1">
                        <tr>
                           <td align="center" valign="bottom" style="padding: 0px 0px 0px 0px;">
                              <a href="#" target="_blank"
                                 style="color:#000;text-decoration:none; display:inline-block;">
                                 <img src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2FupBanner.jpg?alt=media&token=df5c2f20-3a41-4305-acd4-ab88e4709253" alt="Coin Parliament Vote To Earn" class="inx_img"
                                    width="600" height="234" border="0"
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
                              style="color: #0057E1;font-family: 'Poppins', Arial, sans-serif;font-size:20px;line-height: 26px;text-align: left;font-weight:bold;padding-bottom: 25px;"
                              class="inx_title">Welcome to VoteToEarn – Start Voting and Earning!</td>
                        </tr>

                        <tr>
                           <td valign="top"
                              style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:16px;line-height: 20px;text-align: left;font-weight:500;padding-bottom: 15px;">
                              Dear <strong>${displayName}</strong>,
                           </td>
                        </tr>

                        <tr>
                           <td valign="top"
                              style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 25px;">
                              We're excited to have you join our community and embark on an exciting journey of voting
                              and earning rewards.
                           </td>
                        </tr>

                        <tr>
                           <td valign="top"
                              style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:16px;line-height: 22px;text-align: left;font-weight:bold;padding-bottom: 15px;">
                              Here's a quick overview of what you can expect.</td>
                        </tr>

                        <tr>
                           <td valign="top"
                              style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 30px;">
                              Your votes have the power to earn you rewards and shape the direction of the industry.
                           </td>
                        </tr>

                        <tr>
                           <td align="center" valign="top" style="padding-bottom: 30px;">
                              <table width="180" align="center" border="0" cellspacing="0" cellpadding="0">
                                 <tr>
                                    <td align="center">
                                       <a rel="noopener" class="btn_site" target="_blank"
                                          href=${appLink} target="_blank"
                                          style="font-size: 20px;font-family: 'Poppins', Arial, sans-serif;color: #ffffff; font-weight: 500; text-decoration: none; border-radius: 10px; background-color: #4c228e; border-top: 12px solid #4c228e; border-bottom: 12px solid #4c228e; border-right: 18px solid #4c228e; border-left: 18px solid #4c228e; display: block;">Vote
                                          Now!</a>
                                    </td>
                                 </tr>
                              </table>
                           </td>
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
                                                <strong>Your Goal:</strong> Your mission on Vote To Earn is to complete sets and albums
                                                collections of collectible cards. Every vote you cast brings you closer
                                                to achieving this goal.
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
                                                <strong>Voting is Key:</strong> Each vote you make is a step towards completing your collections. So, get ready to vote, collect, and conquer!
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
                                                <strong>Exclusive Rewards:</strong> As you progress and complete collections, you'll unlock exclusive rewards, including VTE coins, unique collectible cards, and valuable crypto tokens.
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
                              style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 26px;text-align: left;font-weight:bold;padding-bottom: 15px;">
                              We're here to support you every step of the way, so if you have any questions or need assistance, feel free to reach out.</td>
                        </tr>

                        <tr>
                           <td valign="top"
                              style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 25px;">
                              Let's make your Vote To Earn experience&nbsp;extraordinary!
                           </td>
                        </tr>


                        <tr>
                           <td valign="top"
                              style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:12px;line-height: 20px;text-align: left;font-weight:400;padding-bottom: 15px;padding-top: 20px;">
                              Best regards,<br />
                              <span style="font-weight: 600;">Vote To Earn Support Team</span>
                           </td>
                        </tr>
                     </table>
                  </td>
               </tr>
               <!-- Content section ends -->

               <!-- Footer Section -->
               <tr>
                  <td align="center" valign="top">
                     <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0057e1">

                        <tr>
                           <td valign="top" align="center" style="padding: 30px 15px 20px;">
                              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                 <tr>
                                    <td align="center" valign="top" style="padding-bottom: 20px;">
                                       <table width="160" border="0" cellspacing="0" cellpadding="0" align="center">

                                          <tr>
                                             <td align="left" valign="middle" width="30" height="30">
                                                <a href="https://linktr.ee/votetoearn" target="_blank"
                                                   style="text-decoration:none; display:inline-block;"><img
                                                      src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Finstagram.png?alt=media&token=1acfe5c4-e570-45a1-b7e5-76ae7c4007af" alt="instagram" width="30" height="30"
                                                      border="0"
                                                      style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                             </td>
                                             <td>&nbsp;</td>
                                             <td align="left" valign="middle" width="30" height="30">
                                                <a href="https://linktr.ee/votetoearn" target="_blank"
                                                   style="text-decoration:none; display:inline-block;"><img
                                                      src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Ffacebook.png?alt=media&token=c0669dc8-4542-476b-bc4e-b5bb4366fc1b" alt="facebook" width="30" height="30"
                                                      border="0"
                                                      style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                             </td>
                                             <td>&nbsp;</td>
                                             <td align="left" valign="middle" width="30" height="30">
                                                <a href="https://twitter.com/CoinParliament" target="_blank"
                                                   style="text-decoration:none; display:inline-block;"><img
                                                      src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Fx-twitter.png?alt=media&token=5b0afbe6-f269-4ae0-9e2d-b05e01df6f85" alt="X Twitter" width="30" height="30"
                                                      border="0"
                                                      style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                             </td>
                                             <td>&nbsp;</td>

                                             <td align="left" valign="middle" width="30" height="30">
                                                <a href="https://linktr.ee/votetoearn" target="_blank"
                                                   style="text-decoration:none; display:inline-block;"><img
                                                      src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Ftiktok.png?alt=media&token=5f4e633d-14dc-412f-9c2b-91480f1028e2" alt="tiktok" width="30" height="30"
                                                      border="0"
                                                      style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                             </td>
                                          </tr>

                                       </table>
                                    </td>
                                 </tr>

                                 <tr>
                                    <td valign="top"
                                       style="color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size:12px;line-height: 18px;text-align: center;font-weight:500;padding-bottom: 15px;">
                                       <a href="https://www.votetoearn.net/privecy-policy" target="_blank"
                                          style="text-decoration: none;color: #c5bdff;">Privacy Policy</a>
                                    </td>
                                 </tr>

                                 <tr>
                                    <td valign="top"
                                       style="color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size:12px;line-height: 18px;text-align: center;font-weight:400;padding-bottom: 5px;">
                                       Copyright &copy; 2022 Vote&nbsp;To&nbsp;Earn&nbsp;(V2E).
                                       All&nbsp;rights&nbsp;reserved.
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

</html>
           `;
};

