import React from "react";
import styled from "styled-components";

const Up = styled.span`
  font-family: var(--font-family-poppins);
  font-weight: 500;
  color: var(--success);
`;

const Down = styled.span`
  font-family: var(--font-family-poppins);
  color: var(--danger);
`;

const Trend = ({ num = 0, toFixed = 2 }: { num: number; toFixed?: number }) => {
  return num >= 0 ? (
    <Up>
      {num > 0 ? "+" : ""}
      {Number(Number(num).toFixed(toFixed))}%
    </Up>
  ) : (
    <Down>{Number(Number(num).toFixed(toFixed))}%</Down>
  );
};

export default Trend;
