import styled from "styled-components";
import { Image } from "react-bootstrap";
import React from "react";

const AvatarImage = styled(Image)`
  width: ${(props: { length: number }) => `${props.length || 40}px`};
  height: ${(props: { length: number }) => `${props.length || 40}px`};
  border-radius: 20px;
  object-fit: cover;
  cursor: pointer;
`;

const Avatar = ({
  url,
  length = 40,
  onClick,
}: {
  url?: string;
  length?: number;
  onClick?: () => void;
}) => {
  const mystery = require("../../assets/avatars/mystery.png");

  url = url || mystery.default || mystery || "";
  return (
    <AvatarImage
      roundedCircle={true}
      src={url}
      length={length}
      onClick={onClick}
    />
  );
};

export default Avatar;
