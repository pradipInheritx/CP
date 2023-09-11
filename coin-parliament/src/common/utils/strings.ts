import randomWords from "random-words";
import { faker } from '@faker-js/faker';
export const generateUsername = () => {
  let username = "";
  do {
    username = faker.internet.userName().replaceAll('.', '').replace(/[0-9]/g, '');
  }
  while (username.length < 8);

  return username;

};


