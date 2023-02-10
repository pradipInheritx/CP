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

const privacy = ``;
const GameRule = ``;

export const myPages: ContentPage[] = [
  {
    title: "About",
    content: about,
    slug: "about",
  },  
  {
    title: "Game Rule",
    content: GameRule,
    slug: "gamerule",
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
