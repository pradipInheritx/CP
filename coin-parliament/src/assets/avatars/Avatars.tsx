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

type AvatarsProps = {
  type: AvatarType;
  width?: number;
  style?: object;
};

export const importFile = (name: string, ext: string = "png") => {
  let src = { default: "" };
  try {
    src = require(`${name}.${ext}`);
  } catch (e) {}

  if (!src) {
    src = { default: "" };
  }

  if (typeof src === "string") {
    src = { default: src as unknown as string };
  }

  return src;
};

export const defaultAvatar = AvatarType.Founder;
const avatarArray = ["Angel",
  "Founder",
  "Hodler",
  "Investor",
  "Trader",]

const Avatars = ({
  type = AvatarType.Angel,
  width = 160,
  style,
}: AvatarsProps) => {
  const src = (type && !type.includes('http')) ? importFile(`./The${type && avatarArray?.includes(type) ? type : defaultAvatar}`).default : type;
// console.log(type,"imgtype")
  return <Image width={width} roundedCircle={true} src={src} style={style} />;
};

export default Avatars;
