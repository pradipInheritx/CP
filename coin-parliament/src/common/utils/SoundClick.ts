// import buttonClick from '../../assets/sounds/buttonClick.wav';
const buttonClick = require("../../assets/sounds/buttonClick.mp3").default;
const Flipcard = require("../../assets/sounds/Flipcard.mp3").default;
const reward = require("../../assets/sounds/Reward-box-opening.mp3").default;
const voteResult = require("../../assets/sounds/voteResultFinish.mp3").default;
const TenSec = require("../../assets/sounds/last-10-sec-for-vote.mp3").default;
const Notification = require("../../assets/sounds/notification.mp3").default;
const voteshound = require("../../assets/sounds/voteshound.wav").default;
const silent = require("../../assets/sounds/silence.mp3").default;
const scratch = require("../../assets/sounds/scratch.mp3").default;
const WinCmp = require("../../assets/sounds/WinCmp.mp3").default;
const giveVote = require("../../assets/sounds/mail-sent.mp3").default;
const getVote = require("../../assets/sounds/ExtraVote.m4a").default;
const getCoin = require("../../assets/sounds/ExtraCoin.mp3").default;

const audio = new Audio(buttonClick);
const onFlipcard = new Audio(Flipcard);
const rewardaudio = new Audio(reward);
const voteButtonSound = new Audio(giveVote);
const lastTensec = new Audio(TenSec);
const NotiSound = new Audio(Notification);
const voteClick = new Audio(voteshound);
const silentSound = new Audio(silent);
const scratchSound = new Audio(scratch);
const WinCmpSound = new Audio(WinCmp);
const voteEnd = new Audio(voteResult);
const ExtraVote = new Audio(getVote);
const ExtraCoin = new Audio(getCoin);

export const handleSoundClick = () => {
  // console.log('play sound')
  audio.play();
};

export const handleExtraVote = {
  play: () => {
    ExtraVote.play();
  },
  pause: () => {
    ExtraVote.pause();
    ExtraVote.currentTime = 0;
  }
};

export const handleExtraCoin = {
  play: () => {
    ExtraCoin.play();
  },
  pause: () => {
    ExtraCoin.pause();
    ExtraCoin.currentTime = 0;
  }
};


export const handleSoundClickCard = {

  play: () => {
    scratchSound.play();
  },
  pause: () => {
    scratchSound.pause();
    scratchSound.currentTime = 0;
  }

};

export const handleSoundWinCmp = {
  play: () => {
    WinCmpSound.play();
  },
  pause: () => {
    WinCmpSound.pause();
    WinCmpSound.currentTime = 0;
  }

};

export const cardFlip = () => {
  // console.log('play sound')
  onFlipcard.play();
};

export const claimyourreward = {
  // console.log('play sound')
  play: () => {
    // rewardaudio.play()
  },
  pause: () => {
    // rewardaudio.pause()
  }
};



export const lastTensecWait = () => {
  lastTensec.play();
};

export const NotificationWait = () => {
  NotiSound.play();
};

export const VoteButton = (voteEndSound = false) => {
  if (voteEndSound) {
    voteEnd.play();
  } else {
    voteEnd.play();
    voteEnd.pause();
    voteEnd.currentTime = 0;
    voteButtonSound.play();
  }

};