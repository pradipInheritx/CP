import React from "react";
import Button from "../Atoms/Button/Button";
import { LoginProviders } from "../../common/models/Login";
import { texts } from "./texts";
import { useTranslation } from "../../common/models/Dictionary";
import styled from "styled-components";
import { PoppinsNormalBlueViolet12px } from "../../styledMixins";

export type LoginWithProps = {
  provider: LoginProviders;
  onClick?:
  | ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void)
  | undefined;
};

const Image = styled.img`
  // height: 17px;
`;

const LoginButton = styled(Button)`
  background: var(--white);
  color: var(--black);
  width: 100%;
  align-items: center;
  justify-content: start;
  
  
`;

const ContinueWith = styled.div`
  ${PoppinsNormalBlueViolet12px};
  min-height: 19px;
  align-self: flex-end;
  margin-left: 32px;
  min-width: 131px;
  letter-spacing: 0;
  white-space: nowrap;
`;

const logos = {
  [LoginProviders.GOOGLE]: process.env.PUBLIC_URL + '/images/icons/google.webp',
  [LoginProviders.FACEBOOK]: process.env.PUBLIC_URL + '/images/icons/facebook.png',

  // [LoginProviders.TWITTER]: "https://coin-parliament.com/images/twitter.png",
};
const LoginWith = ({
  provider = LoginProviders.GOOGLE,
  onClick,
}: LoginWithProps) => {
  const translate = useTranslation();

  const continueWith = (provider: LoginProviders = LoginProviders.GOOGLE) =>
    `${translate(texts.continueWith)} ${translate(provider)}`;

  return (
    <LoginButton {...{ onClick }} style={{ boxShadow: window.screen.width > 979 ? '0px 3px 6px #00000029' : '' }}>
      <Image {...{ src: logos[provider] }} width={28} />
      <ContinueWith>{continueWith(provider)}</ContinueWith>
    </LoginButton>
  );
};

export default LoginWith;
