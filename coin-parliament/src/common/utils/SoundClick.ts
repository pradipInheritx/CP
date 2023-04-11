// import buttonClick from '../../assets/sounds/buttonClick.wav';
const buttonClick = require("../../assets/sounds/buttonClick.mp3").default;
const Flipcard = require("../../assets/sounds/Flipcard.mp3").default;
const reward = require("../../assets/sounds/Reward-box-opening.mp3").default;
const voteResult = require("../../assets/sounds/vote-result-finish.mp3").default;
const TenSec = require("../../assets/sounds/last-10-sec-for-vote.mp3").default;
const Notification = require("../../assets/sounds/notification.mp3").default;
const voteshound = require("../../assets/sounds/voteshound.wav").default;


const audio = new Audio(buttonClick);
const onFlipcard = new Audio(Flipcard);
const rewardaudio = new Audio(reward);
const voteEnd = new Audio(voteResult);
const lastTensec = new Audio(TenSec);
const NotiSound = new Audio(Notification);
const voteClick = new Audio(voteshound);


export const handleSoundClick = () => {
    // console.log('play sound')
    audio.play();
};
  
export const cardFlip = () => {
    // console.log('play sound')
  onFlipcard.play();
};
  
export const claimyourreward = () => {
    // console.log('play sound')
  rewardaudio.play();
};
  
export const voteEndFinish = () => {
    // console.log('play sound')
  voteEnd.play();
};
  
export const lastTensecWait = () => {
    // console.log('play sound')
  lastTensec.play();
};
  
export const NotificationWait = () => {
    // console.log('play sound')
  NotiSound.play();
};
  
export const VoteButton = () => {
    // console.log('play sound')
  voteClick.play();
  };