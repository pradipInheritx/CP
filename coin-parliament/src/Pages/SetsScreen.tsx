import React, { useState } from 'react'
import styled from "styled-components";
import CardForSets from './CardForSets';

const SetBox = styled.div`
  
  height:300px;
  border:2px solid red;  
  position: relative;
  border-radius:10px;
    
`;
const HeadingBox = styled.div`
  width:80%;  
  border:2px solid red;  
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
  allCardNew:any
};


const SetsScreen = ({ allCardNew ,setsValue }: SetsItems) => {
  console.log(allCardNew,"allCardNew")
  console.log(setsValue, "setsValue")
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
    <SetBox className={`${window.screen.width > 767 ? "" : ""} mt-5`}>
      <div className='d-flex justify-content-center align-items-center'>
          <HeadingBox style={{
                          
          }}>
              Set Name
          </HeadingBox>
      </div>
      <div className='d-flex '
        style={{
          position: "relative"
        }}
      >       
        {allCardNew.filter((item:any,index:number) => {
          if (setsValue.setName == item.setName) {
            
            { console.log(item,"getallitem")}
             <div style={{
            //   width:"200px",
            // height: "100px",            
          }}
          // className='border'
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
              // cardNo={`${((item?.setName)?.toUpperCase())?.slice(0, 3) + item?.setId}`}
              // cardNo={item?.sno[index]}
              // GeneralSerialNo={`${((item.collectionName)?.toUpperCase())?.slice(0, 3) + ((item?.setName)?.toUpperCase())?.slice(0, 3) }`}
              cardNo={`${((item?.cardName)?.toUpperCase())?.slice(0, 2) + (item?.id)?.slice(0, 2)}`}
              GeneralSerialNo={item?.sno && (item?.sno[0])?.replace(/[0-9]/g, '')}
              Serie={item?.setName || "Set" + (index + 1)}
              CollectionType={item?.albumName || "LEGENDARY"}

              userId={item?.setId}
              // CollectionType={item?.collectionName}
              // CollectionType={item?.albumId}
              // Disable={"CardDisebal"}                            
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
        
          <div style={{
            //   width:"200px",
            // height: "100px",            
          }}
          // className='border'
          >                  
          <CardForSets />
              </div>
          </div>
    </SetBox>
  )
}
export default SetsScreen;  