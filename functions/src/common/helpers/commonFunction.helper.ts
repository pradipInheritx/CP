import env from "../../env/env.json";
import moment from "moment";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function hashPassword(password: any) {
  const hashPwd = await bcrypt.hash(password, 10);

  return hashPwd;
}

export async function validPassword(password: string, hashedPassword: string) {
  const passwordCheck = await bcrypt.compare(password, hashedPassword);
  return passwordCheck;
}

// Generating auth token
export async function generateAuthToken(userAdmin: any) {
  console.log("USERADMIN >>>>>>>", userAdmin);
  const token = jwt.sign(
    {
      userAdmin,
    },
    env.JWT_AUTH_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const tokenExpiresAt = moment().add(7, "days").format("X");

  const authTokenObj = { token, tokenExpiresAt };

  return authTokenObj;
}

// Generating refresh token
export async function generateRefreshToken(userAdmin: any) {
  const refresh_tokens = jwt.sign(
    {
      userAdmin,
    },
    env.JWT_REFRESH_SECRET
  );

  return refresh_tokens;
}

export async function verifyRefreshToken(refresh_token: string) {
  try {
    const decodedUser = await jwt.verify(refresh_token, env.JWT_REFRESH_SECRET);

    if (!decodedUser) {
      return false;
    }
    return decodedUser;
  } catch (err) {
    return false;
  }
}
