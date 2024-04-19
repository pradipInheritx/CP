
export const userWelcomeEmailTemplate = (userName: any, appLink: any) => {
   return `<!DOCTYPE html
   PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
   xmlns:o="urn:schemas-microsoft-com:office:office">

<head>
   <title>Welcome to Coin Parliament!</title>
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
                           <td align="center" valign="bottom" style="padding: 30px 0px 0px 0px;">
                              <a href="#" target="_blank"
                                 style="color:#000;text-decoration:none; display:inline-block;">
                                 <img src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Fhpbanner.png?alt=media&token=d12b4d52-4b55-46e4-84be-de9ded2109c0" alt="Coin Parliament Vote To Earn" class="inx_img"
                                    width="600" height="240" border="0"
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
                              class="inx_title">Welcome to Coin Parliament!</td>
                        </tr>

                        <tr>
                           <td valign="top"
                              style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:16px;line-height: 20px;text-align: left;font-weight:500;padding-bottom: 15px;">
                              Dear <strong>${userName}</strong>,
                           </td>
                        </tr>

                        <tr>
                           <td valign="top"
                              style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 15px;">
                              Before you dive headfirst into the exciting world of Coin Parliament, we kindly ask you to
                              take just <strong>2 minutes</strong> to read through this email. Trust us, it'll make your
                              journey with us a whole lot clearer and more enjoyable!
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
                                                <strong>Your Goal:</strong> When you vote on Coin Parliament, your aim
                                                is to collect unique collectible cards and complete sets and albums.
                                                Each vote you cast contributes to your Coin Mining Progress (CMP),
                                                bringing you closer to unlocking exciting rewards.
                                             </td>
                                          </tr>
                                       </table>
                                    </td>
                                 </tr>

                                 <tr>
                                    <td align="center" valign="top" style="padding-bottom: 20px;">
                                       <table width="150" align="center" border="0" cellspacing="0" cellpadding="0"
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
                                    <td valign="top" style="padding-bottom: 10px;">
                                       <table width="100%" border="0" cellspacing="0" cellpadding="0" align="left">
                                          <tr>
                                             <td valign="top"
                                                style="font-size: 24px;font-weight: 700;line-height: 14px;padding-right: 10px;">
                                                .</td>
                                             <td valign="top"
                                                style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 0px;">
                                                <strong>Voting Impact:</strong> Each vote has three impacts: Low, Mid,
                                                or High. The higher the impact of your vote, the more progress you make
                                                in CMP. So, keep those votes coming and aim for the stars!
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
                                                <strong>Game Levels:</strong> There are five levels in the game:
                                                Speaker, Council, Ambassador, Minister, and Chairman. The more you
                                                participate and the higher your voting impact, the higher your title
                                                will be. Rise through the ranks and become a true leader in the Coin
                                                Parliament community!
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
                                                <strong>Accelerated Progress:</strong> For each vote result, you'll
                                                receive more CMP and progress faster towards your goals. So, the more
                                                active you are, the faster you'll reach those milestones!
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
                                                <strong>Rewards:</strong> Once you accumulate 100 CMP, get ready for
                                                some exciting rewards.
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
                                                <strong>VTE Coins:</strong> Use them as in-game currency to buy
                                                merchandise and more within the app.
                                                Unique Collectible Card: Add a special card to your collection,
                                                exclusively yours!
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
                                                <strong>PAX Token:</strong> Your votes act as a mining process for PAX
                                                tokens, turning your voting into an active mining process. Earn valuable
                                                PAX tokens while actively participating in the Coin Parliament
                                                community.
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
                              We're here to support you every step of the way, so if you have any questions or need
                              assistance, don't hesitate to reach out to us.
                           </td>
                        </tr>

                        <tr>
                           <td valign="top"
                              style="color: #333333;font-family: 'Poppins', Arial, sans-serif;font-size:14px;line-height: 24px;text-align: left;font-weight:400;padding-bottom: 15px;">
                              Now that you're all caught up, it's time to embark on an incredible journey with Coin
                              Parliament! Let's make it one to remember!
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
                                                      src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Fx-twitter.png?alt=media&token=5b0afbe6-f269-4ae0-9e2d-b05e01df6f85" alt="X Twitter" width="30" height="30"
                                                      border="0"
                                                      style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                             </td>
                                             <td>&nbsp;</td>
                                             <td align="left" valign="middle" width="30" height="30">
                                                <a href="https://www.facebook.com/CoinParliament/" target="_blank"
                                                   style="text-decoration:none; display:inline-block;"><img
                                                      src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Ffacebook.png?alt=media&token=c0669dc8-4542-476b-bc4e-b5bb4366fc1b" alt="facebook" width="30" height="30"
                                                      border="0"
                                                      style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                             </td>
                                             <td>&nbsp;</td>
                                             <td align="left" valign="middle" width="30" height="30">
                                                <a href="https://www.instagram.com/coinparliament/" target="_blank"
                                                   style="text-decoration:none; display:inline-block;"><img
                                                      src="https://firebasestorage.googleapis.com/v0/b/coin-parliament-staging.appspot.com/o/assests%2Femails%2Finstagram.png?alt=media&token=1acfe5c4-e570-45a1-b7e5-76ae7c4007af" alt="instagram" width="30" height="30"
                                                      border="0"
                                                      style="display:block;color: #ffffff;font-family: 'Poppins', Arial, sans-serif;font-size: 16px;line-height: 20px;"></a>
                                             </td>
                                             <td>&nbsp;</td>
                                             <td align="left" valign="middle" width="30" height="30">
                                                <a href="https://www.tiktok.com/@coinparliament" target="_blank"
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
