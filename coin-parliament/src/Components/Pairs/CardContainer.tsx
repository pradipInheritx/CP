import styled from "styled-components";

interface GridProps {
  cols?: number;
  gap?: number;
  offset?: number;
}

const CardsContainer = styled.div`
  width: ${(props: GridProps) => `${100 + (props?.offset || 0) * 2}%`};
  margin-left: ${(props: GridProps) => `-${props?.offset || 0}%`};
  padding: 25px 0;
  display: grid;
  grid-template-columns: ${(props: GridProps) =>
    `repeat(${props.cols ? props.cols : 3}, 1fr)`};
  column-gap: ${(props: GridProps) => `${props.gap ? props.gap : 9}px`};
  row-gap: 1em;

  & > div {
    min-width: 0;
    flex-grow: 1;
    flex-basis: 0;
  }
`;

export default CardsContainer;
