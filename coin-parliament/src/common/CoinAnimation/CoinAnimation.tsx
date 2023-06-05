import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import "./style.css";


type Coinanimationprops = {
 
};

function CoinAnimation({ }: Coinanimationprops) {
    const [animationStart, setAnimationStart] = useState <any> (false)
    useEffect(() => {
        setTimeout(() => {
        setAnimationStart(true)
    }, 1000);    
    }, [])
    
  return (
    <div className={window.screen.width > 767 ? "coin-main":"coin-mainMOb"}>
      <div className={animationStart ? "coin1 animeted" :"coin1"}></div>
          <div
            //   className="coin1 coin-dalay1"
          className= {animationStart ? "coin1 animeted coin-dalay1" :"coin1 coin-dalay1"}
          ></div>
          <div
            //   className="coin1 coin-dalay2"
              className= {animationStart ? "coin1 animeted coin-dalay2" :"coin1 coin-dalay2"}
          ></div>
          <div
            //   className="coin1 coin-dalay3"
              className= {animationStart ? "coin1 animeted coin-dalay3" :"coin1 coin-dalay3"}
          ></div>
          <div
            //   className="coin1 coin-dalay4"
              className= {animationStart ? "coin1 animeted coin-dalay4" :"coin1 coin-dalay4"}
          ></div>
    </div>
  )
}

CoinAnimation.propTypes = {}

export default CoinAnimation
