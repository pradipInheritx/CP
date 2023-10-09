/** @format */

import React from "react";
import { Image } from "react-bootstrap";

export enum AvatarType {
  Angel = "Angel",
  Founder = "Founder",
  Hodler = "Hodler",
  Investor = "Investor",
  Trader = "Trader",
}
export const defaultAvatar = AvatarType.Founder;

type AvatarsProps = {
  type: AvatarType | string;
  width?: number;
  style?: object;
};
const avatarArray = ["Angel",
  "Founder",
  "Hodler",
  "Investor",
  "Trader",]
export const importFile = (name: string, ext: string = "png") => {
  let src = { default: "" };
  try {
    src = require(`${name}.${ext}`);
  } catch (e) { }

  if (!src) {
    src = { default: "" };
  }

  if (typeof src === "string") {
    src = { default: src as unknown as string };
  }

  return src;
};

const Avatars = ({
  type = AvatarType.Angel,
  width = 160,
  style,
}: AvatarsProps) => {
  const src = (type && !type.includes('http')) ? importFile(`./The${type && avatarArray?.includes(type) ? type : defaultAvatar}`).default : type;
  // console.log(src, 'importFile');
  // @ts-ignore
  return <img style={{ height: '35px', width: '35px', borderRadius: '50px' }} src={src} alt="Logo" referrerpolicy="no-referrer" />;
};

export default Avatars;
