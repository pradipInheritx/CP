import randomWords from "random-words";

export const generateUsername = () => {
  return randomWords({
    exactly: 1,
    wordsPerString: 2,
    join: "",
    maxLength: 7
  });
};
