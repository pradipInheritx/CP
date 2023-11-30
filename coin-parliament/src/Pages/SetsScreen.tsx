import React, { useState } from 'react'
import styled from "styled-components";
import CardForSets from './CardForSets';

const SetBox = styled.div`
  border:2px solid #f3822e;  
  position: relative;
  border-radius:10px;
    
`;
const HeadingBox = styled.div`
  width:80%;  
  border:2px solid #f3822e;  
  top:-35px;  
  position: absolute;
  padding:10px;
//   margin-left:20px;
  border-radius:10px;
  text-align: center;  
`;

export type SetsItems = { 
  type:any
  setsValue:any
  allCardNew: any
  onSelectSets:any
  winerCard?:any
};


const SetsScreen = ({ type ,onSelectSets, allCardNew, setsValue, winerCard }: SetsItems) => {
  const [backCards, setBackCards] = useState<any>([]);
  console.log(allCardNew,"allCardNew")
  const BackSideCard = (value: string | number) => {
    // @ts-ignore
    if (backCards.includes(value)) {
      let allBackCard = [...backCards];
      allBackCard.splice(backCards.indexOf(value), 1);
      setBackCards(allBackCard)
    }
    else {
      setBackCards([...backCards, value])
    };
  };

  const CheckCardDisable = (cardId: any) => {
    var disableCard;

    let cardTrue = winerCard?.find((winCard: any, index: number) => {

      if (winCard?.firstRewardCardId != cardId) {

        disableCard = "CardDisebal"
        return false
      }
      if (winCard?.firstRewardCardId == cardId) {

        disableCard = undefined
        return true
      }

    })
    return disableCard
  }


  return (
    <SetBox className={`mt-5 mx-1`}
      onClick={() => {
        onSelectSets(setsValue?.id)
    }}
      style={{
        width: `${window.screen.width > 767 ? "24%" : "w-100"}`
    }}
    >
      <div className='d-flex justify-content-center align-items-center'>
          <HeadingBox style={{
                     backgroundColor:`${type=="nftalbum"?"#4c39b2":"white"}`     
          }}>
          {setsValue?.setName}
          </HeadingBox>
      </div>
      <div className='d-flex justify-content-around flex-wrap my-2'
        style={{
          position: "relative"
        }}
      >       
        {allCardNew?.map((item:any,index:number) => {
          if (setsValue?.setName == item?.setName) {                        
           return  <div style={{
          }}          
           >
             {type=="nftalbum" ?
            <CardForSets
              key={index}
              DivClass={item?.cardType}
              HeaderText={item?.cardType}
              HeaderClass={`${item?.cardType}_text`}
              BackCardName={item?.cardName}
              Rarity={item?.cardType}
              Quantity={item?.totalQuantity}
              holderNo={item?.noOfCardHolders}
              cardNo={`${((item?.cardName)?.toUpperCase())?.slice(0, 2) + (item?.id)?.slice(0, 2)}`}
              GeneralSerialNo={item?.sno && (item?.sno[0])?.replace(/[0-9]/g, '')}
              Serie={item?.setName || "Set" + (index + 1)}
              CollectionType={item?.albumName || "LEGENDARY"}
              userId={item?.setId}              
              cardHeader={`${item?.cardName}`}
              id={item?.id || item?.cardId}
              BackSideCard={BackSideCard}
              fulldata={item}
              flipCard={backCards?.includes(item?.id)}
              ImgUrl={item?.cardImageUrl || ""}
              VideoUrl={item?.cardVideoUrl || ""}
               />
               :
               <CardForSets
                 key={index}
                 DivClass={item?.cardType}
                 HeaderText={item?.cardType}
                 HeaderClass={`${item?.cardType}_text`}
                 Serie={item?.setName || "Set" + index}
                 BackCardName={item?.cardName}
                 Rarity={item?.cardType}
                 holderNo={item?.noOfCardHolders}
                 cardNo={`${((item?.cardName)?.toUpperCase())?.slice(0, 2) + (item?.id)?.slice(0, 2)}`}                 
                 CollectionType={item?.albumName || "LEGENDARY"}
                 Disable={winerCard.length ? CheckCardDisable(item?.cardId) : 'CardDisebal'}
                 userId={item?.setId}
                 cardHeader={`${item?.cardName}`}
                 id={item?.cardId}
                 BackSideCard={BackSideCard}
                 fulldata={item}
                 flipCard={backCards?.includes(item?.cardId)}
                 ImgUrl={item?.cardImageUrl || ""}
                 VideoUrl={item?.cardVideoUrl || ""}
               />}
             
          </div>
          }
        })}                 
          </div>
    </SetBox>
  )
}
export default SetsScreen;  