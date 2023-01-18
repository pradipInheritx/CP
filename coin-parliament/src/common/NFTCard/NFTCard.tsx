import React from 'react'
import './style.css'
import TheEagle from '../../assets/images/TheEagle.png'
type MintingProps = {
  
    cardType?:any,
  
  }
function NFTCard({cardType='legendary'}: MintingProps) {
    const classname=`card shadow ${cardType.toLowerCase()} `
   console.log('classname',classname)
    return (
        <div className={classname} >
            <div> 
                <span className={`${cardType.toLowerCase()}_text`} >&nbsp; {cardType?.toUpperCase()} &nbsp; </span> 
                <span className="cardname">THE <strong>HODLER</strong></span>
                <div className="card-body"> <img src={TheEagle} alt="the hgodler" className="img-fluid"/></div>
            </div>
        </div>
    )
}

export default NFTCard
// position: absolute;
//     left: 0;
//     bottom: 0;
//     top: 0;
//     scale: 0.1;
//     z-index: 2;
//     width: 161px;
//     /* max-width: 134px; */
//     /* display: flex; */
//     /* height: 100px; */
   
//     card 
//     width: 100%;
//     height: auto;
//     text-align: center;

//     card body
//     width: 100%;