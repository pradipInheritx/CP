import React from 'react'
import './style.css'
import { gsap } from "gsap";
import container from './images/container.png'
import blank from './images/blank.png'
import cap from './images/cap.png'
import confettisticker2 from './images/confettisticker2.gif'
import trader from './images/trader.png'
import NFTCard from '../../../common/NFTCard/NFTCard';
function AnimationReward() {
    
var audios = document.getElementById('audio');

//var shake = gsap.from(".cap , .box", {x:10 , repeat:-10 ,  duration:0.1, delay:1, })

var animation = gsap.timeline();

animation
//.fromTo(".cap , .box",{x:-7 , ease: "slow(0.7, 0.7, false)" ,  duration:0.1,}, {x:7 , repeat:6 , yoyo:true,  duration:0.1, delay:0.6, ease: "slow(0.7, 0.7, false)" })

.to(".cap", {y:-40 , delay:0.5,   ease: "circ.out"})
.to(".cap", {x:70 ,  ease: "circ.out" })
.to(".cap", {y:95 ,top: -70,left:29,rotate: 73, ease: "circ.out" },"-=0.5")
.to(".blast", {y:-220 , opacity:1},"-=0.4" )
.to(".trader", { y:-220, scale:1, "z-index":4,} , "-=0.5")
.to(".trader", { y:-73,  })
.to(".blast", {opacity:0,} )
.to(".b2", {y:-220 , opacity:1} )
 .to(".blueCard1", { y:-191, scale:1, "z-index":4,},"-=0.6")
 .to(".b2", {opacity:0,} )
.to(".blueCard1", { y:-19, x:-130 },"-=0.5")
 .to(".b3", {y:-202 , opacity:1} )
 .to(".blueCard2", { y:-191, scale:1, "z-index":4, }, "-=0.5")
.to(".blueCard2", { y:-19, x:132 })
.to(".b3", {opacity:0} )



 






// .to(".cap", {y:-40 , duration:0.5 , ease: "circ.out"})
// .to(".cap", {x:70 , duration:0.2})
// .to(".cap", {y:70 ,top: -75,left:13,rotate: 64,  duration:0.4,  },"+=0.2")
// .to(".blast", {y:-202 , opacity:1} , "-=0.2")
// .to(".trader", { y:-191, scale:1, "z-index":4, duration:1, },"-=0.7")
// .to(".trader", { y:-73,  },)
// .to(".blast", {opacity:0,} )
// .to(".b2", {y:-202 , opacity:1} , "-=0.7")
// .to(".blueCard1", { y:-191, scale:1, "z-index":4, duration:1, },"-=1.2")
// .to(".b2", {opacity:0,} )
// .to(".blueCard1", { y:-19, x:-130 })
// .to(".blueCard2", { y:-191, scale:1, "z-index":4, duration:1, },"-=0.9")
// .to(".b3", {y:-202 , opacity:1} , "-=0.5")

// .to(".blueCard2", { y:-19, x:128 })
// .to(".b3", {opacity:0,},"-=0.2" )


   
    return (
       <> <div className="boxHolder">
  

  
    <div className="cardBg blueCard1 ">
          <div className="whiteRound card_1">
        <h1>+40</h1>

            </div>      
    </div>
    
     <div className="cardBg blueCard2 votes">
          <div className="whiteRound card_1">
        <h1>+20</h1>

            </div>      
       
    </div>
    
    
    
    
  <img className="box" src={container} alt="redbox"/>
    
    <img className="box boxBlank" src={blank} alt="redbox"/>
  
  <img className="cap" src={cap} alt="redcap"/>
    
    <img className="blast" src={confettisticker2} alt="371908020-CONFETTI-400px"/>
    <img className="b2" src={confettisticker2} alt="371908020-CONFETTI-400px"/>
    <img className="b3" src={confettisticker2} alt="371908020-CONFETTI-400px"/>
    
 {/* <img className="trader trader_active" src={trader} alt="trader-Image"/>  */}
 <div className="trader"><NFTCard /></div>
    
  </div>
  <div className='backdrop'></div>
  </>
    )
}

export default AnimationReward
