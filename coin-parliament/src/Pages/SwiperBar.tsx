import React from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export type SliderItems = {

};
function SwiperBar({ children, slideSize = 5 }: { children: React.ReactNode | string, slideSize?: number }) {
  console.log(children,"children")
  var settings = {
    dots: true,
    infinite: false,
    centerMode: true,
    speed: 500,
    slidesToShow: slideSize,
    slidesToScroll: slideSize,
    initialSlide: 0,
    prevArrow: false,
    nextArrow: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          
          dots: true
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          infinite: true,
        }
      },
      {
        breakpoint: 450,
        settings: {
          centerMode: true,
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          infinite: true,
        }
      },
      // {
      //   breakpoint: 390,
      //   settings: {
      //     centerMode: true,
      //     slidesToShow: 0.5,
      //     slidesToScroll: 1,
      //     initialSlide: 1,
      //     variableWidth: true,
      //     infinite: true,
      //   }
      // }
    ]
  };
  return (
    <div className=''
      style={{ overflow: "hidden" }}
    >
      {/* @ts-ignore */}
      <Slider {...settings} className='w-100'>
        {/* @ts-ignore */}
        {children}
      </Slider>
    </div>
  );
}

export default SwiperBar;