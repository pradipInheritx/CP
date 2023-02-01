import React from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


export type SliderItems = {
  
};
function SwiperBar( {children}: { children: React.ReactNode | string }) {
   var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 3,
      initialSlide: 0,
      responsive: [
        
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            initialSlide: 1
          }
        },
        
      ]
    };
  return (
    <div>
      {/* @ts-ignore */}
        <Slider {...settings} >
                  {/* @ts-ignore */}
           {children}
        </Slider>
    </div>
  )
}

export default SwiperBar