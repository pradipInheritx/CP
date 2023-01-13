import React from "react";
import { Container } from "react-bootstrap";
import { calcFavorites } from "../common/utils/coins";
import Coins from "../Components/Coins/Coins";

const CoinMain = () => {
  return (
    <Container>
      <Coins expanded onFavClick={calcFavorites} />
    </Container>
  );
};

export default CoinMain;
