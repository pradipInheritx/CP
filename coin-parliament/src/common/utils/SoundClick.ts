// import buttonClick from '../../assets/sounds/buttonClick.wav';
const buttonClick = require("../../assets/sounds/buttonClick.wav").default;
const audio = new Audio(buttonClick);
export const handleSoundClick = () => {
    console.log('play sound')
    audio.play();
  };