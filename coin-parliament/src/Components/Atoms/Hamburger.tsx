import React from "react";
import styled from "styled-components";
const Bar = styled.div`
  width: 27px;
  height: 2px;
  background-color: var(--white);
  margin: 6px 0;
`;
const Hamburger = () => {
  return (
    <>
      <Bar />
      <Bar />
      <Bar />
    </>
  );
};

export default Hamburger;
