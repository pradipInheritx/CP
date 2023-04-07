import {ContentPage} from "../../Contexts/ContentContext";
// import GameRule from "../../Pages/GameRule";

const headers = [
  "What is the purpose of the Coin Parliament?",
  "What kind of skills or knowledge do I need to become a Parliament member?",
  "What is the Coin Parliament voting indicator (CPVI)|?",
  "Is it 100% safe to depend on my investments/trades on the (CPVI)|?",
  "Why should I share my votes?",
  "Why should we invite friends to the Parliament?",
  "What is pool mining ?",
  "Why should you take it seriously before you vote?",
  "Why should I share my votes?",
  "What is a PAX token?",
  "Why should I make the effort to earn PAX?",
  "What is mining?",
  "What is the status of Parliament members?",
];

const body = [
  "Coin Parliament Bigger Parliament means more accurate results and better success rates in trading and investments for the Parliament members.",
  " Coin Parliament was created for all users from beginner to professional ",
  " The Coin Parliament Voting Indicator (CPVI)  used to measure the success rate and volume of votes on the Coin Parliament platform. \n              The CPVI is displayed as an oscillator (a line graph that moves between two extremes) and can have a reading from 0 to 100.\n              Values above 50 indicate that more users voted “BULL” meaning more people are going to buy this coin.\n              Values below 50 indicate that more users voted “BEAR” meaning more people are going to sell this coin. ",
  " No, never depend any of your financial investments or trades on other people, platforms, advisors opinions. Always do your research and don’t risk what you can’t allow to lose ",
  "Sharing your votes on social media such as Facebook, Twitter, Whatsapp can help the Parliament to get and show more accurate  results for the CPVI and increase your pool earnings.",
  " When you invite friends to the Parliament you are creating your own pool and your friends voting increases your CPM and your earning! The more friends you invite the more coins you can earn. ",
  "Pool mining is the group of your friends you invited to the Parliament. Your friends voting is your pool mining ",
  " Voting correctly will give you a better score and you will be rewarded with more CPM that will help you to earn more PAX and you will get a higher rank as a Parliament member. ",
  "Sharing your votes on social media such as Facebook, Twitter, Whatsapp can help the Parliament to get and show more accurate  results for the CPVI and increase your pool earnings.",
  "PAX is a BEP based token ",
  "PAX token got value in the market and as soon as the Parliament PAX mint reaches 50% of the total minting it will be listed in exchange and you will be able to trade it. ",
  " Mining in the Parliament means voting. Voting for more coins and pairs will increase your earnings ",
  " Each and every member of Coin Parliament got a status. Check the table for status and CPM for each status. PLEASE NOTE your Parliament status is dynamic and it depends on your voting success. You can climb up and down in your status depending on your voting success rate. \n              \n\t\t\t\t\n\t\t\t\t\tMinister - 5 I am on top of the world\n\t\t\t\t\tAmbassador - 4 If your dreams don't scare you, they aren’t big enough\n\t\t\t\t\tConsul - 3 Don’t just talk about it BE ABOUT IT!\n\t\t\t\t\tSpeaker - 2 Hard work is a two-way street, You get back exactly what you put in.\n\t\t\t\t\tMember- 1It’s just the beginning - I am here to stay\n\t\t\t\t\t\n\t\t\t\t\n            ",
];

export const faq = headers.map((h, i) => {
  return {
    title: headers[i].trim(),
    content: body[i].trim(),
  };
});

const about =
  "Coin Parliament aims to provide a community environment where all of our users can share their opinions and vote freely and learn from each other. Everyone is welcome to come to our platform and provide insightful, delightful and informative thoughts, but we also hope to provide a space where everyone respects each other without spam, abuse or promotional messages. We want all users to feel comfortable and safe being in the space. Therefore, we are setting up some community rules to define what is acceptable and what is not — all users are expected to follow our community guidelines!\n\nWhoever fails to follow our rules will have their messages deleted, and further action taken if necessary. Coin Parliament could temporarily or permanently suspend accounts from being able to post, comment, repost or share any messages from the Coin Parliament discussion feature if community rules are repeatedly violated.";

export const privacy = `<p>1. CoinParliament.com and its affiliates (collectively, &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) create, publish, and run social games for web and mobile environments (collectively, &quot;games&quot;), as well as web and mobile applications (each, an &quot;App&quot;) for playing our games on many devices and platforms.</p>

<p>2. CoinParliament.com is dedicated to safeguarding your privacy and individually identifiable information (&quot;Personal Information&quot;).</p>

<p>3. This Privacy Policy was created to inform you about the types of personal information we (or anyone acting on our behalf) acquire from you when you use our online or mobile offerings (the &quot;Services&quot;), how that information is collected, and how it is used.</p>

<p>4. This Privacy Policy is part of the Terms &amp; Conditions and should be read in conjunction with them. You agree that we (or others acting on our behalf) may collect, record, store, adapt, alter, analyze, retrieve, use, transfer, process, transmit, disseminate, make available, restrict, erase, destruct, combine, and/or disclose (&quot;process&quot;) your personal information in accordance with the terms of this Privacy Policy when you access or use our offerings and/or services. ​&nbsp;</p>

<p>&nbsp;</p>

<p><strong>II. Collection of Personal Information ​</strong></p>

<p>5. We (or those acting on our behalf) collect your email address as well as a unique activity log for you that contains administrative and traffic information, such as time of access, date of access, and usage history. Furthermore, if you give us any personal information, we may collect that information as well.</p>

<p>6. We (or those acting on our behalf) collect the aforesaid personal information when you use the services or when you provide it to us, and also in your communications with us.</p>

<p>7. You are responsible for ensuring the accuracy of your personal information and all other information you submit to us (or others on our behalf). Inaccurate personal information will affect the information you receive when using the services and our ability to contact you as contemplated in this Privacy Policy. You may update your personal information by logging into your account and updating your personal information or by e-mailing customer support at&nbsp;<a href="mailto:support@coinparliament.com">support@coinparliament.com</a>. For service quality assurance, any contact made by you to the customer service department may be recorded, documented, and used by us at our sole discretion.</p>

<p>&nbsp;</p>

<p><strong>III. Processing Personal Information ​</strong></p>

<p>8. We use the personal information and other information we (or others on our behalf) collect from or about you for a variety of reasons, including but not limited to, delivering the services, providing customer support, conducting necessary security and identity verification checks, processing any of your online or mobile transactions, meeting certain business and/or regulatory requirements, and any other reason related to the operation of the services. We may disclose your personal information (and any other information) to any third parties that provide services to us in order to allow, enable, or improve the provision of the services to you. Without derogating from the above, your personal information will be disclosed to our employees and staff members for the purpose of providing support services, credit management services, and fraud prevention services; to our accountants and auditors for accounting and auditing purposes; and to our partners for the purpose of providing the services. Your personal information may also be used by us, our licensees, and/or affiliates (including any service providers acting on their behalf) (collectively, the &quot;Marketers&quot;) to send you promotional offers and information about the Services, as well as products and services from the Marketers and other third parties, and to help us improve our offering of a variety of products and services and customer service. The promotional offers may be provided to you via various means, including but not limited to (i) email and/or (ii) via the services (including, but not limited to, push notifications, pop-ups, or pop-unders). We may also use the aforesaid personally identifiable information to track your use of the services and for other internal purposes, such as evaluating, providing, and improving the services.</p>

<p>9. We may disclose your personal information and other information we (or others on our behalf) collect from or about you if required to do so by law, or if we believe in good faith that such action is necessary to comply with a current judicial proceeding, a court order or legal process, or to protect and defend our rights or property, the personal safety of users of the services, or the public.</p>

<p>We reserve the right to share the aforesaid information with any third party if we determine in our sole discretion that you have cheated or attempted to defraud us, or if we suspect you of committing any fraudulent activity (including fraudulent payment), or any other prohibited transaction.</p>

<p>10. We may transfer any personal information outside your country of residence and outside the European Union and store it in other countries. The data protection and other laws of these countries may not be as comprehensive as those in the European Union. In these instances, we will take steps to ensure that a sufficient level of protection is given to your personal information.​</p>

<p>&nbsp;</p>

<p><strong>IV. Retention of Personal Information ​</strong></p>

<p>11. We will retain all of your personal information for the time set by applicable legislation in order to maintain our rights.</p>

<p>&nbsp;</p>

<p><strong>V. Choice/Opt-Out</strong></p>

<p>12. You may opt-out of receiving promotional communications from us by sending a blank e-mail with the word &ldquo;Remove&rdquo;. If you have any questions relating to opting-out, please contact our customer support. Please note that even if you opt-out, we may continue to send you service-related updates and notifications.</p>

<p>&nbsp;</p>

<p><strong>VI. Cookies ​</strong></p>

<p>13. We (or others on our behalf) use a browser feature known as cookies, which are small text files that are placed on your computer or equipment when you visit certain online or mobile pages, to track your activities, record your preferences, and make the services more responsive to your needs by delivering a better and more personalized experience to you. The cookies are stored on your computer and/or equipment and are used by us to help track your activity and pass information as you use the services. Cookies can allow us to associate navigational information from browsing visits with the personal information you provide to us.&nbsp;</p>

<p>&nbsp;</p>

<p><strong>VII. Security ​</strong></p>

<p>14. We have implemented suitable security policies, rules, and technical measures to protect and safeguard the personal information under its control from unauthorized access, improper use or disclosure, unauthorized modification, unlawful destruction, or accidental loss. All of our employees and data processors that have access to, and are associated with the processing of your personal information, are obliged to respect the confidentiality of your personal information. ​</p>

<p>&nbsp;</p>

<p><strong>VIII. Links to Other Sites ​</strong></p>

<p>15. Our websites, mobile sites, and mobile applications may contain links to other websites, mobile sites, and mobile applications. Other websites, mobile sites, and mobile applications may also reference or link to our website, mobile site, and/or mobile application. We are not responsible for the privacy practices or the content of such other websites, mobile sites, and mobile applications, and any information collected by these third-party websites, mobile sites, and mobile applications is not governed by this Privacy Policy, and we assume no responsibility or liability whatsoever for the policies (including privacy policies), practices, actions or omissions of such third parties.</p>

<p>&nbsp;</p>

<p><strong>IX. Transfer ​</strong></p>

<p>16. In the event that we sell, assign, or transfer some or all of our business or assets to a successor or acquirer, directly or indirectly, including, but not limited to, in connection with the sale, merger, acquisition, and/or bankruptcy and/or insolvency proceedings, we may sell, assign, or transfer all of your personal information and other information provided by you or about you, regardless of your opt status, to such successor or acquirer.​</p>

<p>&nbsp;</p>

<p><strong>X. Disclaimer ​</strong></p>

<p>17. The transmission of information via the internet is not completely secure. Although we do our best to protect your personal information, we cannot guarantee the security of the data transmitted to our website, mobile site, and/or mobile application; transmission is at your own risk. Accordingly, we (including our directors, officers, shareholders, suppliers, advisors, contractors, and affiliates) will not be liable for any direct, indirect, incidental, consequential, and/or punitive damages relating to the use or release of personal information resulting from events outside of our control.&nbsp;</p>

<p>&nbsp;</p>

<p><strong>XI. Your Acceptance of This Policy ​</strong></p>

<p>18. By agreeing to the Terms &amp; Conditions during the registration process on our website, mobile site, and/or mobile application, or by continued use of the services, you agree to be bound by this privacy policy and to any changes, we may make to this privacy policy from time to time. We will notify you of any such changes to the Privacy Policy by posting an updated version of the privacy policy on our website, mobile site, and/or mobile application. Your continued use of the services will amount to and be construed as your consent to such changes.&nbsp;</p>`;
const GameRule = ``;
const Foundations = ``;
const Partners = ``;

export const myPages: ContentPage[] = [
  {
    title: "About",
    content: about,
    slug: "about",
  },  
  {
    title: "Game Rules",
    content: GameRule,
    slug: "gamerule",
  },    
  {
    title: "Partners",
    content: Partners,
    slug: "partners",
  },    
  {
    title: "Foundations",
    content: Foundations,
    slug: "foundations",
  },    
  {
    title: "FAQ",
    content: privacy,
    slug: "FAQ",
  },
];

export type Quote = { text: string; source: string }
export const quotes: Quote[] = [
  {
    text: "Free Speech is the Bedrock of a Functioning Democracy",
    source: "Elon Musk",
  },
  {
    text: "You’ve got to vote, vote, vote, vote. That’s it; that’s the way we move forward",
    source: "Michelle Obama",
  },
  {
    text: "It's not enough to just want change ... You have to go and make change by voting",
    source: "Taylor Swift",
  },
  {
    text: "All of us may have been created equal. But we'll never actually be equal until we all vote. So don't wait",
    source: "Leonardo DiCaprio",
  },
  {
    text: "A man without a vote is a man without protection",
    source: "Lyndon B. Johnson",
  },
  {
    text: "Voting is not only our right—it is our power",
    source: "Loung Ung",
  },
  {
    text: "If you don’t vote, you lose the right to complain",
    source: "George Carlin",
  },
  {
    text: "Someone struggled for your right to vote. Use it",
    source: "Susan B. Anthony",
  },
  {
    text: "There’s no such thing as a vote that doesn’t matter. It all matters",
    source: "Barack Obama",
  },
  {
    text: "We have the power to make a difference. But we need to VOTE",
    source: "Kylie Jenner",
  },
  {
    text: "Talk is cheap, voting is free; take it to the polls",
    source: "Nanette L. Avery",
  },
];

export const social = {};
