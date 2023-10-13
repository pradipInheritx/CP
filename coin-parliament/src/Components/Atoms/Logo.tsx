import React from "react";
import styled from "styled-components";
import logo from "../../assets/svg/sporangemob.svg";
import {useWindowSize} from "../../hooks/useWindowSize";
import useScrollPosition from "../../hooks/useScrollPosition";
import {positionBreakpoint} from "../Background";
import {useLocation} from "react-router-dom";

export enum Size {
  XXSMALL = "xxsmall",
  XSMALL = "xsmall",
  SMALL = "small",
  MEDIUM = "medium",
  LARGE = "large",
}

export type ImgProps = {
  size: Size;
  width?: number;
  scrollPosition: number;
  pathname: string;
};

const Image = styled.img`
  box-shadow: 0 3px 6px #00000029;
  opacity: 1;
  width: ${(props: ImgProps) => `${isWideLogo(props)|| window.screen.width>979 ? 233 : (width[props.size || Size.XSMALL])}px`};
  border-radius: ${(props: ImgProps) => `${isWideLogo(props)|| window.screen.width>979  ? "" : "100%"}`};
`;

const width = {
  [Size.XXSMALL]: 40,
  [Size.XSMALL]: 58,
  [Size.SMALL]: 74,
  [Size.MEDIUM]: 128,
  [Size.LARGE]: 236,
};

const isWideLogo = (props: ImgProps) => ((props.scrollPosition < positionBreakpoint && props.width && props.width > 979) || (props.scrollPosition > positionBreakpoint && props.width && props.width > 979 && props.pathname !== "/"));

const Logo = ({size}: { size: Size }) => {
  const {width} = useWindowSize();
  const scrollPosition = useScrollPosition();
  const location = useLocation();
  const pathname = location.pathname;
  const src = isWideLogo({size, width, scrollPosition, pathname}) ? "/long_1@4x.png" : logo;
  return <Image src={window.screen.width>979?"/long_1@4x.png":src} size={size} width={width} scrollPosition={scrollPosition} pathname={pathname}/>;
};

export default Logo;
