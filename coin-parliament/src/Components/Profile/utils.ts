export const validatePassword = (newPassword: string, username: string) => {
  const check1 = new RegExp(
    /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9@#$^+=])(.{8,15})$/
  ).test(newPassword);

  const check2 = !new RegExp(/\b^.*([a-zA-Z0-9])\1\1+.*\b/gm).test(newPassword);
  const check3 = !newPassword.includes(username);
  return check1 && check2 && check3;
};
