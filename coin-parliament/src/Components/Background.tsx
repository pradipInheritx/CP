/** @format */

import React from "react";
import styled from "styled-components";
import { isHomeBg, Pathname } from "./App/App";
import { Gradient1, Gradient2, Gradient3 } from "../styledMixins";
import { isCoinsPairs, isProfile } from "../common/utils/title";
import { useWindowSize } from "../hooks/useWindowSize";
import useScrollPosition from "../hooks/useScrollPosition";
import { useParams } from "react-router-dom";

type Props = Pathname & { scrollPosition: number };

export const positionBreakpoint = 84;

const BG = styled.div`
  min-height: 100vh;
  width: 100%;
  ${(props: Props) =>
    isHomeBg(props.pathname)
      ? Gradient1
      : isCoinsPairs(props.pathname)
      ? Gradient3
      : Gradient2};
`;

const BGContainer = styled.div`
  position: fixed;
  height: ${(props: Props) =>
    `${
      props.pathname === "/"
        ? props.width && props.width > 979
          ? 120
          : props.scrollPosition < positionBreakpoint
          ? 120
          : 120
        : 120
    }px`};
  width: 100%;
  background:#160133;
  ${(props: Props) =>
    isProfile(props.pathname)
      ? "border-radius: 0px 0px 80px 0px"
      : "border-radius: 0px 0px 0px 0px"
      };
  
  overflow: hidden;
  z-index: 1;
`;

const Background = ({ pathname }: { pathname: string }) => {
  let params = useParams();
  const { width } = useWindowSize();
  const scrollPosition = useScrollPosition();
  
  return (
    <BGContainer
      pathname={pathname}
      // width={width}
      scrollPosition={scrollPosition}
    >
      <div>
        <BG
          pathname={pathname}
          scrollPosition={scrollPosition}
          style={{
            // height: "200px",
            // border: "5px solid red",
            background:
              (isCoinsPairs(pathname) && pathname?.includes("coins/")) ||
              (isCoinsPairs(pathname) && pathname?.includes("pairs/"))||
              (isCoinsPairs(pathname) && pathname?.includes("CardShow/"))
                ? "#160133"
                : "",
          }}
        />
      </div>
    </BGContainer>
  );
};

export default Background;
