import React from 'react'
import styled from "styled-components";

const SetBox = styled.div`
  
  height:300px;
  border:2px solid red;  
  position: relative;
  border-radius:10px;
    
`;
const HeadingBox = styled.div`
  width:80%;  
  border:2px solid red;  
  top:-20px;  
  position: absolute;
  padding:10px;
//   margin-left:20px;
  border-radius:10px;
  text-align: center;
  background-color:#4c39b2;
`;

export default function SetsScreen() {
  return (
      <SetBox className={`${window.screen.width > 767 ? "w-50" : "w-100"} d-flex justify-content-center align-items-center flex-column`}>
          <HeadingBox style={{
                          
          }}>
              Set Name
          </HeadingBox>
          <div>
              
          </div>
    </SetBox>
  )
}
