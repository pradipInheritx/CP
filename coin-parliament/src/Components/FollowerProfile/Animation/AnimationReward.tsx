import React from 'react'
import './style.css'
import { gsap } from "gsap";
import container from './images/container.png'
import blank from './images/blank.png'
import cap from './images/cap.png'
import confettisticker2 from './images/confettisticker2.gif'
import trader from './images/trader.png'
import NFTCard from '../../../common/NFTCard/NFTCard';
type MintingProps = {
  
  setRewardTimer?:any,
  rewardTimer?:number
}
function AnimationReward({setRewardTimer,rewardTimer}: MintingProps) {
    
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
.to(".b3", {opacity:0,
  // @ts-ignore
  // onComplete: () => foo("test"),
} )

gsap.to('div', {
  // x: 120,
  duration: 15,
  // rotation: 270,
  // @ts-ignore
  onComplete:  () => foo("test"),
  // stagger: .2
})

function foo() {
  setRewardTimer(null)
}


console.log('rewarditem',rewardTimer)


    return (
       <> <div className="boxHolder" style={{
        right: window?.screen?.width<767?'':'0px',
        width: window?.screen?.width<767?'':'55%',
        marginLeft:window?.screen?.width<365?'74px':''
       

       }}>
  

  
    <div className="cardBg blueCard1 ">
          <div className="whiteRound card_1">
            {/* @ts-ignore */}
        <h1>+{rewardTimer?.data?.thirdRewardDiamonds}</h1>

            </div>      
    </div>
    
     <div className="cardBg blueCard2 votes">
          <div className="whiteRound card_1">
            {/* @ts-ignore */}
        <h1>+{rewardTimer?.data?.secondRewardExtraVotes}</h1>

            </div>      
       
    </div>
    
    
    
    
  <img className="box" src={container} alt="redbox"/>
    
    <img className="box boxBlank" src={blank} alt="redbox"/>
  
  <img className="cap" src={cap} alt="redcap"/>
    
    <img className="blast" src={confettisticker2} alt="371908020-CONFETTI-400px"/>
    <img className="b2" src={confettisticker2} alt="371908020-CONFETTI-400px"/>
    <img className="b3" src={confettisticker2} alt="371908020-CONFETTI-400px"/>
    
 {/* <img className="trader trader_active" src={trader} alt="trader-Image"/>  */}
 {/* @ts-ignore */}
 <div className="trader"><NFTCard cardType={rewardTimer?.data?.firstRewardCardType}/></div>
    
  </div>
  <div className='backdrop'></div>
  </>
    )
}

export default AnimationReward
