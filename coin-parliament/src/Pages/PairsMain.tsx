import React from "react";
import Pairs from "../Components/Pairs/Pairs";
import { calcFavorites } from "../common/utils/coins";
import { Container } from "react-bootstrap";

const PairsMain = () => {
  return (
    <Container>
      <Pairs expanded onFavClick={calcFavorites} />
    </Container>
  );
};

export default PairsMain;
