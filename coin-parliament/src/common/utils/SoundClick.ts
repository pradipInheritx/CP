// import buttonClick from '../../assets/sounds/buttonClick.wav';
const voteResult = require("../../assets/sounds/voteResultFinish.mp3").default;

const voteEnd = new Audio(voteResult);

export const VoteButton = (voteEndSound = false) => {
  if (voteEndSound) {
    voteEnd.play();
  } else {
      voteEnd.pause(); 
  }
};
