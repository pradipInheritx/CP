// import randomWords from "random-words";

export const generateUsername = () => {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  let username = "";

  // Generate a random username by picking characters from the alphabet
  for (let i = 0; i < 10; i++) {
    username += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return username
  // return randomWords({
  //   exactly: 1,
  //   wordsPerString: 2,
  //   join: "",
  //   min:8,
  //   maxLength: 4
  // });
};
