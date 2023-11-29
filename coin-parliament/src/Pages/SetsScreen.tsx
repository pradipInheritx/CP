import React from 'react'
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
  console.log(setsValue,"setsValue")
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
          <div style={{
            //   width:"200px",
            // height: "100px",            
          }}
          // className='border'
          >                  
          <CardForSets
          />
        </div>
        
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