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
  background-color:#4c39b2;
`;

export type SetsItems = { 
  setsValue:any
  allCardNew: any
  onSelectSets:any
};


const SetsScreen = ({ onSelectSets,allCardNew ,setsValue }: SetsItems) => {
  const [backCards, setBackCards] = useState<any>([]);

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

  return (
    <SetBox className={`mt-5 mx-1`}
      onClick={() => {
        onSelectSets(setsValue.id)
    }}
      style={{
        width: `${window.screen.width > 767 ? "24%" : "w-100"}`
    }}
    >
      <div className='d-flex justify-content-center align-items-center'>
          <HeadingBox style={{
                          
          }}>
          {setsValue.setName}
          </HeadingBox>
      </div>
      <div className='d-flex justify-content-around flex-wrap my-2'
        style={{
          position: "relative"
        }}
      >       
        {allCardNew.map((item:any,index:number) => {
          if (setsValue.setName == item.setName) {                        
           return  <div style={{
          }}          
          >
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
          </div>
          }
        })}                 
          </div>
    </SetBox>
  )
}
export default SetsScreen;  