import React, { useContext } from "react";
import styled from "styled-components";
import {Heart} from "../Atoms/Checkbox/Icon";
import {Image} from "react-bootstrap";
import {Coin, formatCurrency, precision} from "../../common/models/Coin";
import {Buttons} from "../Atoms/Button/Button";
import {symbolCombination} from "./utils";
import {LogoImgContainer} from "../Coins/Card";
import AppContext from "../../Contexts/AppContext";
import UserContext from "../../Contexts/User";
import { useLocation } from "react-router-dom";

const LighCart1 = styled.div`
  //width: 100%;
  max-width: ${(props: { pathname: string,single: boolean }) =>
  props.pathname?.includes('/pairs') ? "236px" : ''};
  width:  ${(props: { pathname: string,single: boolean }) =>
  props.pathname?.includes('/pairs') ? "236px" : ''};
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  height: ${(props: { single: boolean }) =>
          props.single ? undefined : "125px"};
  background-color: ${(props: { single: boolean }) =>
          props.single ? "transparent" : "var(--white)"};
  border-radius: 6px;
  padding: 10px 12px;
  border: ${(props: { single: boolean }) =>
          props.single ? 0 : "1px solid #3712b3"};
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-grow: 1;
  flex-basis: 0;
  min-width: 0;
`;

export type LogoProps = {
  symbol: string;
  width?: number;
};

export const Logo = ({ symbol, width = 35 }: LogoProps) => {
  return (
    <Image
      src={process.env.PUBLIC_URL + `/images/logos/${symbol.toUpperCase()}.svg`}
      style={{
        maxWidth: width,
        margin: "0 auto",
        width: width,
        height: width,
      }}
    />
  );
};

const CoinNameXYZ = styled.div`
  flex: 1;
  font-family: var(--font-family-poppins);
  color: var(--ebony);
  font-size: ${(props: { single: boolean }) =>
          props.single ? "var(--font-size-16)" : "var(--font-size-12)"};
  text-align: center;
  letter-spacing: 0;
  line-height: 1.1;
  white-space: nowrap;
  font-weight: 400;
`;

const Span0 = styled.div`
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HeartContainer = styled.div`
  display: flex;
  margin-right: -50px;
    margin-top: -80px;
    position: absolute;
  align-self: ${(props: { single: boolean }) =>
    props.single ? "flex-end" : "flex-start"};
`;

const Component127371 = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VOTE = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-bold)
    var(--font-size-11) / var(--line-spacing-13) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-6352e8);
  text-align: center;
  opacity: 1;
  margin-right: 3px;
`;

const OverlapGroup = styled.div`
  width: 21px;
  height: 61px;
  position: relative;
  align-self: center;
  display: flex;
  align-items: center;
`;

const CardsContainer = styled.div`
  width: 100%;
  justify-content: space-around;
  align-items: center;
  display: flex;
`;

const VS = styled.div`
  left: 0;
  font-family: var(--font-family-poppins);
  font-weight: 700;
  color: var(--blue-violet);
  font-size: var(--font-size-l);
  letter-spacing: 0;
  line-height: 25px;
  white-space: nowrap;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: ${(props: { single: boolean }) =>
            props.single ? "initial" : "-43px"};
    bottom: ${(props: { single: boolean }) =>
            props.single ? "-78px" : "initial"};
    left: 9px;
    width: 0;
    height: ${(props: { single: boolean }) => (props.single ? "77px" : "42px")};
    border: 1px solid var(--blue-violet);
    opacity: 1;
  }

  &::after {
    content: "";
    position: absolute;
    width: 8px;
    height: 0;
    border: 1px solid var(--blue-violet);
    opacity: 1;
    bottom: ${(props: { single: boolean }) =>
      props.single ? "flex-end" : "flex-start"};
    top: ${(props: { single: boolean }) => (props.single ? "initial" : "-2px")};
    bottom: ${(props: { single: boolean }) =>
      props.single ? "-2px" : "initial"};
    left: 6px;
  }
`;

export type CoinCardProps = {
  favorite: boolean;
  setFavorite: (f: boolean) => void;
  coin1: Coin;
  coin2: Coin;
  onClick: () => void;
  name?: string;
  single?: boolean;
  coins: { [symbol: string]: Coin };
};

const Group3991 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 35px;
`;

const Price = styled.div`
  min-width: 56px;
  font-family: var(--font-family-poppins);
  font-weight: 400;
  color: ${(props: { single: boolean }) =>
          props.single ? "var(--white)" : "#23036a"};
  font-size: ${(props: { single: boolean }) =>
          props.single ? "var(--font-size-16)" : "var(--font-size-13)"};
  text-align: center;
  letter-spacing: 0;
  line-height: 16px;
  white-space: nowrap;
`;

const CoinCard = ({
  coin,
  onClick,
  single,
  coins,
}: { coin: Coin; onClick: () => void; single: boolean, coins: { [symbol: string]: Coin }; }) => (
  <LogoContainer>
    <Buttons.ClickableText onClick={onClick} style={{cursor: single ? "default" : undefined}}>
      <LogoImgContainer {...{single}}>
        <Logo {...{symbol: coin.symbol, width: single ? 40 : 35}} />
      </LogoImgContainer>
    </Buttons.ClickableText>
    <div className="my-2">
      <CoinNameXYZ {...{single}}>
        {single && <div className="fw-bolder"> {coin.name}</div>}
        {!single && <Span0><Buttons.ClickableText onClick={onClick} className="fw-bolder">
          {coin.name}
        </Buttons.ClickableText></Span0>}
        {single && <div>{coin.symbol}</div>}
        {!single && <Span0><Buttons.ClickableText onClick={onClick}>
          {coin.symbol}
        </Buttons.ClickableText></Span0>}
      </CoinNameXYZ>
    </div>
    {single && <div className="my-2">
      <Group3991>
        <Price {...{single}}>{formatCurrency(coins[coin.symbol]?.price, precision[coin.symbol])}</Price>
      </Group3991>
    </div>}
  </LogoContainer>
);

const Card = ({
  favorite,
  setFavorite,
  coin1,
  coin2,
  onClick,
  name = "favorites",
  single = false,
  coins,
}: CoinCardProps) => {
  const combination = symbolCombination([coin1.symbol, coin2.symbol]);
  const location = useLocation();
  const pathname = location.pathname;
  const {user} = useContext(UserContext);
  const {setLoginRedirectMessage,loginRedirectMessage,setLogin} = useContext(AppContext );
  console.log('pathname',pathname)
  return (
    <LighCart1 {...{ single,pathname }}>
      <HeartContainer {...{ single }} onClick={
        ()=>{
          if(!user?.uid){
            setLoginRedirectMessage('add pairs to favorites.')
            setLogin(true)
          }
        }}>
        <Heart
        
          checked={favorite}
          setChecked={setFavorite}
          id={`fav-${combination}`}
          value={combination}
          name={name}
        />
      </HeartContainer>
      <CardsContainer>
        <CoinCard coin={coin1} onClick={onClick} single={single} coins={coins}/>
        <OverlapGroup>
          <VS {...{single}}>VS</VS>
        </OverlapGroup>
        <CoinCard coin={coin2} onClick={onClick} single={single} coins={coins}/>
      </CardsContainer>
      {!single && (
        <Component127371>
          <Buttons.ClickableText onClick={onClick} className="shine2 p-2" style={{margin: "-0.5rem"}}>
            <VOTE>VOTE</VOTE>
            <img
              width="6"
              height="10"
              src="https://coin-parliament.com/svg/arrow-right.svg"
              alt="vote"
            />
          </Buttons.ClickableText>
        </Component127371>
      )}
    </LighCart1>
  );
};

export default Card;
