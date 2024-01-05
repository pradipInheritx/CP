import React from "react";

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useWindowSize } from "../../hooks/useWindowSize";
import styled from "styled-components";


const responsive = ({ gutter = false, items }: { gutter: boolean, items: number }) => {
  return {
    desktop: {
      breakpoint: { max: 3000, min: 969 },
      items,
      slidesToSlide: items,
      partialVisibilityGutter: gutter ? 30 : undefined,
    },
    mobile: {
      breakpoint: { max: 969, min: 0 },
      items,
      slidesToSlide: items,
      partialVisibilityGutter: gutter ? 60 : undefined,
    },
  };
};

const deviceType = (width?: number, quotes?: Boolean) => {
  if (!width || quotes) {
    return "mobile";
  }
  if (width > 979) {
    return "desktop";
  }

  return "mobile";
};

const CarouselWrapper = styled.div`

  transition: all 0.3s ease;
  width: ${(props: { width?: number; centerMode?: boolean; coin?: boolean }) => props.centerMode ? `${(props.width || 0) + 60 * 2}px` : undefined};
  overflow-x: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;
  margin-bottom: 30px;

  &::-webkit-scrollbar {
    display: none;
  }

  .react-multi-carousel-dot-list {
    bottom: -30px;
    margin: 0 auto;

    & .react-multi-carousel-dot--active.react-multi-carousel-dot button {
      opacity: 1;
    }

    & .react-multi-carousel-dot button {
      width: 8px;
      height: 8px;
      background: var(--electric-violet);
      opacity: 0.4;
      border: 0;
    }
  }
&{
  .react-multiple-carousel__arrow {
    z-index:1;
  }
}
  & {
    .react-multi-carousel-item {
      transform: scale(1);
      max-width: ${(props: { width?: number; centerMode?: boolean; coin?: boolean }) => props.coin && !props.centerMode ? `130px !important` : undefined};
     width: ${(props: { width?: number; centerMode?: boolean; coin?: boolean }) => props.coin && !props.centerMode ? `130px !important` : undefined};
    }

    .react-multi-carousel-item--active {
      z-index: 1;
    }
  }
`;

const SwiperButton = styled.div`
display: flex;
  justify-content: space-between;
  margin:10px;
  & button{    
    background:black;
    color:white;
    width:30px;
    height:30px;
    border-radius:50px;
  }
`

const MyCarousel = ({
  children,
  centerMode,
  items = 3,
  quotes,
  coin,
  cursorShow,
  transitionDuration
}: { children: React.ReactNode, centerMode?: boolean, items?: number, quotes?: boolean, coin?: boolean, cursorShow?: boolean, transitionDuration?: number }) => {
  // const {width} = useWindowSize();


  const ButtonGroup = ({ next, previous, goToSlide, ...rest }: any) => {
    const { carouselState: { currentSlide } } = rest;
    return (
      <>
        {window.screen.width > 767 ? <SwiperButton className=''>
          <button className='' onClick={() => previous()}>
            {" "}
            {"<"}{" "}
          </button>
          <button onClick={() => next()}>
            <span className=''> {">"} </span>
          </button>
        </SwiperButton> : ""}
      </>
    );
  };
  return (
    <CarouselWrapper width={window.screen.width} centerMode={centerMode} coin={coin} >
      {/* @ts-ignore */}
      <Carousel
        customButtonGroup={cursorShow == true ? <ButtonGroup /> : <></>}
        arrows={cursorShow != true ? true : false}
        swipeable={true}
        draggable={true}
        showDots={true}
        renderDotsOutside={true}
        renderButtonGroupOutside={true}
        autoPlay={quotes ? true : false}
        focusOnSelect={true}
        responsive={centerMode ? responsive({ gutter: true, items: 1 }) : responsive({ gutter: false, items })}
        centerMode={centerMode || false}
        additionalTransfrom={centerMode ? -60 : coin ? -64 : undefined}
        infinite={true}
        keyBoardControl={true}
        transitionDuration={transitionDuration ? transitionDuration : 0}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["mobile"]}
        deviceType={deviceType(window.screen.width, quotes)}
        shouldResetAutoplay={false}
      >
        {children}
      </Carousel>
    </CarouselWrapper>
  );
};

export default MyCarousel;
