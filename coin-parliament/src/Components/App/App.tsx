import styled from "styled-components";
import Container from "react-bootstrap/Container";
import {Gradient1, Gradient2, Gradient3, PoppinsMediumWhite12px} from "../../styledMixins";
import {isAdmin, isCoinsPairs, isProfile, isSinglePage} from "../../common/utils/title";

export const stage = 1;

// @ts-ignore
export const isV1 = () => stage === 0;
// @ts-ignore
export const isV2 = () => stage === 2;
// @ts-ignore
export const isV3 = () => stage === 3;


export type Pathname = { pathname: string; login?: string; width?: number };

export const getBackground = (props: Pathname) => {
  const purple = "var(--color-160133) 0% 0% no-repeat padding-box";
  const blueViolet = "var(--blue-violet) 0% 0% no-repeat padding-box";
  const light = "var(--light-purple) 0% 0% no-repeat padding-box";

  if (props.width && props.width > 979) {
    return purple;
  }

  if (props.login === "true") {
    return light;
  }

  if (isSinglePage(props.pathname, "coins")) {
    return purple;
  }

  if (isSinglePage(props.pathname, "pairs")) {
    return purple;
  }

  if (isProfile(props.pathname)) {
    return blueViolet;
  }

  return "";
};

const getHeight = (props: Pathname) => {
  if (props.login === "true" || isAdmin(props.pathname)) {
    return "100%";
  }

  if (
    isSinglePage(props.pathname, "coins") ||
    isProfile(props.pathname) ||
    isSinglePage(props.pathname, "pairs")
  ) {
    return "233px";
  }

  return "100vh";
};

export const isHomeBg = (pathname: string) => ["/", "/influencers"].includes(pathname);

export const AppContainer = styled(Container)`
  ${(props: Pathname) => (isHomeBg(props.pathname) ? Gradient1 : (isCoinsPairs(props.pathname) ? Gradient3 : Gradient2))};
  ${PoppinsMediumWhite12px};
  opacity: 1;
  min-height: ${(props: Pathname) =>
          isSinglePage(props.pathname, "coins") ||
          isProfile(props.pathname) ||
          isSinglePage(props.pathname, "pairs")
                  ? ""
                  : "100vh"};
  height: ${(props: Pathname) => getHeight(props)};
  border-radius: ${(props: Pathname) =>
    isSinglePage(props.pathname, "coins") ||
    isProfile(props.pathname) ||
    isSinglePage(props.pathname, "pairs")
      ? "0px 0px 87px 0px"
      : ""};
  padding: 0;
  width: 100vw;
`;

export const HomeContainer = styled(Container)`
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  color: var(--white);
  font-family: var(--font-family-poppins);
  font-style: normal;
  width: 100%;
  min-width: ${(props: { width?: number }) => props.width && props.width > 979 ? "233px" : undefined};
margin-top:${(props: { width?: number }) => props.width && props.width > 979 ? "170px" : undefined};
  & h2 {
    font-size: var(--font-size-xxxl);
    line-height: 29px;
    text-transform: uppercase;
    margin-top: 15px;
    margin-bottom: 8px;

    & span {
      display: ${(props: { width?: number }) =>
              `${props.width && props.width > 969 ? "inline" : "block"}`};
    }
  }

  & p {
    font-size: var(--font-size-xl);
    line-height: 20px;
    margin-bottom: 15px;
  }
`;

export const H1 = styled.h1`
  color: var(--color-6352e8);
  text-align: left;
  font: normal normal medium 23px/34px Poppins;
  font-size: ${(props: { desktop?: string }) =>
    `${props.desktop === "true" ? 20 : 23}px`};
  letter-spacing: 0;
  text-shadow: 0 3px 6px #00000053;
  opacity: 1;
`;

type PageContainerProps = {
  color?: string;
  radius?: number;
  shadow?: string;
};
export const PageContainer = styled(Container)`
  background: ${(props: PageContainerProps) =>
    `${props.color || "var(--color-ffffff)"} 0 0% no-repeat padding-box`};
  box-shadow: ${(props: PageContainerProps) =>
    props.shadow || "0 3px 6px #00000029"};
  border-radius: ${(props: PageContainerProps) =>
    `0 0 ${props.radius || 0}px 0`};
  opacity: 1;
  padding: 0;
`;

export const CardContainer = styled.div`
  background: var(--color-160133) 0 0% no-repeat padding-box;
  height: 190px;
  padding: 0;
  box-shadow: 0 3px 6px #00000029;
  border-radius: 0 0 87px 0;
`;

export const getSubdomain = (admin?: boolean) => {
  if (admin) {
    return true;
  }
  const urlParts = new URL(window.location.href).hostname.split(".");
  return admin && urlParts.length === 3 ? urlParts[0] : undefined;
};
