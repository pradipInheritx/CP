export const userWelcomeEmailTemplate = (userName: any, appLink: any) => {
  return `
          <!DOCTYPE html>
          <html>
          <head>
          
            <meta charset="utf-8">
            <meta http-equiv="x-ua-compatible" content="ie=edge">
            <title>Coin Parliament Welcome</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
            /**
             * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
             */
            @media screen {
              @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 400;
                src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
              }
              @font-face {
                font-family: 'Source Sans Pro';
                font-style: normal;
                font-weight: 700;
                src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
              }
            }
            /**
             * Avoid browser level font resizing.
             * 1. Windows Mobile
             * 2. iOS / OSX
             */
            body,
            table,
            td,
            a {
              -ms-text-size-adjust: 100%; /* 1 */
              -webkit-text-size-adjust: 100%; /* 2 */
            }
            /**
             * Remove extra space added to tables and cells in Outlook.
             */
            table,
            td {
              mso-table-rspace: 0pt;
              mso-table-lspace: 0pt;
            }
            /**
             * Better fluid images in Internet Explorer.
             */
            img {
              -ms-interpolation-mode: bicubic;
            }
            /**
             * Remove blue links for iOS devices.
             */
            a[x-apple-data-detectors] {
              font-family: inherit !important;
              font-size: inherit !important;
              font-weight: inherit !important;
              line-height: inherit !important;
              color: inherit !important;
              text-decoration: none !important;
            }
            /**
             * Fix centering issues in Android 4.4.
             */
            div[style*="margin: 16px 0;"] {
              margin: 0 !important;
            }
            body {
              width: 100% !important;
              height: 100% !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            /**
             * Collapse table borders to avoid space between cells.
             */
            img {
              height: auto;
              line-height: 100%;
              text-decoration: none;
              border: 0;
              outline: none;
            }
            .button {
                display: inline-block;
                padding: 10px 20px;
                font-size: 16px;
                text-align: center;
                text-decoration: none;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            </style>
          
          </head>
          <body style="background-color: #e9ecef;">
          <h2>Dear ${userName},</h2>

          <h3>Greetings and a warm welcome to Coin Parliament, the epicenter of Web 3.0 social gaming! 🎮</h3>
          <p>We are delighted to have you as part of our community, and we're here to guide you through an immersive experience that goes beyond traditional gaming.</p>

          <center><a href="${appLink}" style="background-color: #064273; color: white; border: 5px; border-radius: 5px; cursor: pointer;" target="_blank">Vote Now!</a></center>

          <h2>Discover Web 3.0 Magic:</h2>
          <p>Coin Parliament isn't just a game; it's a dynamic Web 3.0 social gaming platform where every vote and action you take ripples through the community. Get ready for a gaming adventure where cryptocurrency mining and social voting intertwine, shaping a new era of interactive and rewarding experiences.</p>

          <h2>What Awaits You at Coin Parliament:</h2>

          <ul>
            <li><strong>Coin Mining Process (CMP):</strong> Dive into the CMP, mine PAX tokens, and witness the impact of your votes on the Social Voting Indicator (SVI).</li>
            <li><strong>Exclusive Cards:</strong> Achieve 100 CMP to unlock exclusive cards, each adding a unique flair to your growing collection.</li>
            <li><strong>Game Coins (VTE):</strong> Trade seamlessly within the app, using game coins to enhance your overall gaming and mining experience.</li>
            <li><strong>Ambassador Program:</strong> Share the excitement with our Ambassador Program and unlock a lifetime of passive income.</li>
          </ul>

          <p><strong>Ready to Begin the Adventure?</strong> Download the Coin Parliament app now and step into a world where social gaming meets the future!</p>

          <center><a href="${appLink}" style="background-color: #064273; color: white; border: 5px; border-radius: 5px; cursor: pointer;" target="_blank">Vote Now!</a></center>

          <p>If you have any questions or need assistance along the way, our dedicated support team is here to help at <a href="mailto:support@email.com">support@email.com</a>.</p>

          <p>Thank you for choosing Coin Parliament, where your journey in Web 3.0 social gaming begins!</p>

          <p>Best regards,
          <br><br>
          Coin Parliament Team
          </p>
           
          </body>
          </html>
          `;
};
