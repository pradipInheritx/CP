/** @format */

import React from "react";
import styled from "styled-components";

const MenuBar = styled.div`
  flex-wrap: nowrap;
  overflow: scroll;
  padding: 7px;
  background-color: #6352e8;
  & span {
    opacity: 0.4;
    font-weight: 100;
    padding: 5px 40px;
    font-size: 12px;
  }
`;
const CenterItem = styled.div`
  padding: 7px;
  background-color: #e3e3e3;
  height: 500px;
  & span {
  }
`;
const NFTGallery = () => {
  return (
    <div className='h-100'>
      <div>
        <MenuBar className=''>
          <span className=''>Hello</span>
          <span className=''>Hello</span>
          <span className=''>Hello</span>
          <span className=''>Hello</span>
          <span className=''>Hello</span>
        </MenuBar>
      </div>
      <CenterItem>
        <div></div>
      </CenterItem>
    </div>
  );
};

export default NFTGallery;
