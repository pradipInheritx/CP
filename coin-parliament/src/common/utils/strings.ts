import randomWords from "random-words";

export const generateUsername = () => {
  
  return randomWords({
    exactly: 1,
    wordsPerString: 2,
    join: "",
    min:8,
    maxLength: 4
  });
};
