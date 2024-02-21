import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import styled from "styled-components";
import { Heart } from "../Atoms/Checkbox/Icon";
import { BearVsBullRow, getVotes } from "../../common/models/CoinTable";
import { Image } from "react-bootstrap";
import { Coin, formatCurrency, precision } from "../../common/models/Coin";
import CoinsContext, { Totals } from "../../Contexts/CoinsContext";
import { Buttons } from "../Atoms/Button/Button";
import Trend from "../Atoms/utils/Trend";
import UserContext from "../../Contexts/User";
import AppContext from "../../Contexts/AppContext";
import { useParams } from "react-router-dom";
import arrow from '../../assets/svg/arrow-right.svg'
import { texts } from "../LoginComponent/texts";
const LighCart1 = styled.div`
  cursor: pointer;
  max-width: 350px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 9px 11.4px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: { single: boolean }) =>
    props.single ? "transparent" : "var(--white)"};
  border: ${(props: { single: boolean }) =>
    props.single ? 0 : "1px solid #3712b3"};
  opacity: 1;
  border-radius: 6px;
  margin: 0 auto;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`;

const Group3991 = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 35px;
`;

const Logo = ({ symbol, single }: BearVsBullRow & { single: boolean }) => {  
  return (
  <>
      {        
      <Image
        src={process.env.PUBLIC_URL + `/images/logos/${symbol?.toUpperCase()}.svg`}
        style={{
          margin: "0 auto",
          width: single ? 70 : 50,
          height: single ? 70 : 50,
        }}
        onError={(e) =>
          ((e.target as HTMLImageElement).src = "/images/no_logo.png")
        }
      />
      }
    </>
  );
  
};

const CoinNameXYZ = styled.div`
  flex: 1;
  font-family: var(--font-family-poppins);
  color: var(--ebony);
  // font-size: ${(props: { single: boolean }) => props.single ? "var(--font-size-18)" : "var(--font-size-12)"};
  line-height: 1.1;
  text-align: center;
  letter-spacing: 0;
  white-space: nowrap;
  font-weight: 400;
`;

const Span1 = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Span0 = styled(Span1)`
  font-weight: 700;
`;

const Price = styled.div`
  min-width: 56px;
  font-family: var(--font-family-poppins);
  font-weight: 400;
  color: ${(props: { single: boolean }) => props.single ? "var(--white)" : "#23036a"};
          

  font-size: ${(props: { single: boolean }) =>
    props.single ? "var(--font-size-18)" : "var(--font-size-16)"};
  text-align: center;
  letter-spacing: 0;
  line-height: 16px;
  white-space: nowrap;
`;

const Trend1 = styled.div`
  letter-spacing: 0;
  font-family: var(--font-family-poppins);
  font-size: ${(props: { single: boolean }) =>
    props.single ? "var(--font-size-16)" : "var(--font-size-13)"};
  text-align: center;
  line-height: 16px;
  white-space: nowrap;
  color: ${(props: { single: boolean }) =>
    props.single ? "var(--white)" : ""};
`;

const Votes = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal)
    var(--font-size-11) / var(--line-spacing-13) var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-00000099);
  text-align: center;
  min-height: 18px;
  margin-top: 17px;
  opacity: 1;
`;

const HeartContainer = styled.div`
  top: ${(props: { isHeader: boolean, single: boolean }) => props.isHeader ? "5em" : "12.5em"};
  right: ${(props: { isHeader: boolean, single: boolean }) => props.isHeader ? "5em" : "1em"};
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

export type CoinCardProps = {
  favorite: boolean;
  setFavorite: (f: boolean) => void;
  symbol: string;
  coins: { [symbol: string]: Coin };
  totals: { [key: string]: Totals };
  onClick?: () => void;
  name?: string;
  single?: boolean;
  isHeader?: boolean;
};

export const LogoImgContainer = styled.div`
margin-top:20px;
  border-radius: 100%;
  // border: 1px solid var(--white);
  // background: var(--white);
  padding: 0;
  // -webkit-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.75);
  // -moz-box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.75);
  // box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.75);
  cursor: ${(props: { single: boolean }) =>
    props.single ? "default" : "pointer"};

  &:hover {
    // background: var(--white);
    opacity: 0.8;
  }
`;

const Card = ({
  favorite,
  setFavorite,
  symbol,
  coins,
  totals,
  onClick,
  name = "favorites",
  single = false,
  isHeader = false,
}: CoinCardProps) => {
  const { user } = useContext(UserContext);
  const { setLoginRedirectMessage, loginRedirectMessage, setLogin } = useContext(AppContext);
  const [changeColor, setChangeColor] = useState<string>("black");
  const [currentPrice, setCurrentPrice] = useState<any>(0)
  const [zoom, setZoom] = useState(false)
  const prevCountRef = useRef(currentPrice)

  // console.log('reference',coins[symbol]?.randomDecimal)
  // const OnlyCheckColor = () => {
  //   // setInterval(() => {
  //   if (coins[symbol]?.price == prevCountRef.current) {
  //     setChangeColor("black")
  //   }
  //   else if (coins[symbol]?.price > prevCountRef.current) {
  //     console.log("check i am working")
  //     setChangeColor("Green")
  //   }
  //   else if (coins[symbol]?.price < prevCountRef.current) {
  //     setChangeColor("Red")
  //   }
  //   // },5000);
  //   // console.log(coins[symbol]?.price,"checkprice")
  //   setCurrentPrice(coins[symbol]?.price)
  // }
  // useEffect(() => {
  //   // console.log(currentPrice,"currentPrice")
  //   prevCountRef.current = currentPrice;
  //   OnlyCheckColor()
  // }, [
  //   coins[symbol]?.price,
  // ])

  const OnlyCheckColor = () => {
    // setInterval(() => {            
    if (`${coins[symbol]?.price}${coins[symbol]?.randomDecimal}` == prevCountRef.current) {
      setChangeColor("white")
    }
    else if (`${coins[symbol]?.price}${coins[symbol]?.randomDecimal}` > prevCountRef.current) {
      setChangeColor("Green")
    }
    else if (`${coins[symbol]?.price}${coins[symbol]?.randomDecimal}` < prevCountRef.current) {
      setChangeColor("Red")
    }
    // },5000);
    setCurrentPrice(`${coins[symbol]?.price}${coins[symbol]?.randomDecimal}`)
  }
  useEffect(() => {
    prevCountRef.current = currentPrice;
    OnlyCheckColor()
  }, [
    `${coins[symbol]?.price}${coins[symbol]?.randomDecimal}`
  ])

  // console.log(coins[symbol]?.price,"check both price")

  let params = useParams();

  return (
    <LighCart1
      {...{ single }}
      style={{ transition: "transform .5s", transform: `${zoom ? "scale(1.07)" : "scale(1)"}` }}
      onMouseEnter={() => setZoom(true)}
      onMouseLeave={() => setZoom(false)}
      onClick={onClick}

    >
      <HeartContainer {...{ single, isHeader }} style={{ marginTop: Object.keys(params).length !== 0 ? '' : '-142px' }} onClick={
        () => {
          if (!user?.uid) {
            setLoginRedirectMessage('add coin to favorites')
            setLogin(true)
          }
        }
      }>
        <Heart
          checked={favorite}
          setChecked={setFavorite}
          id={`fav-${symbol}`}
          value={symbol}
          name={name}
        />
      </HeartContainer>
      <LogoContainer>
        <LogoImgContainer onClick={onClick} single={single}>
          <Logo {...{ symbol, single }} />
        </LogoImgContainer>
        <div className="my-2 ">
          <CoinNameXYZ {...{ single }}>
            <Span0 style={{ fontSize: "20px" }}>
              {single && (
                <span className="fw-bolder" >{coins[symbol]?.name}</span>
              )}
              {!single && (
                <Buttons.ClickableText onClick={onClick}>
                  <span className="fw-bolder">{coins[symbol]?.name}</span>
                </Buttons.ClickableText>
              )}
            </Span0>
            <Span1 style={{ fontSize: "20px" }}>
              {single && <span>{symbol}</span>}
              {!single && (
                <Buttons.ClickableText onClick={onClick}>
                  {coins[symbol]?.symbol}
                </Buttons.ClickableText>
              )}
            </Span1>
          </CoinNameXYZ>
        </div>
      </LogoContainer>
      <Group3991>
        <Price {...{ single }}
          style={{ color: `${changeColor}` }}

        >{formatCurrency(coins[symbol]?.price, precision[symbol])}{(symbol != 'BTC' && symbol != 'ETH') && coins[symbol]?.randomDecimal}</Price>
        {/* <Trend1 {...{single}}>
          <Trend num={coins[symbol]?.trend || 0}/>
        </Trend1> */}
      </Group3991>
      {/* {!single && <Votes>{getVotes(symbol, totals)} Votes</Votes>} */}

      {!single && (
        <Component127371>
          {/* <Buttons.ClickableText onClick={onClick} className="shine2 p-2"> */}
          <Buttons.ClickableText onClick={onClick} className="p-2">
            <VOTE>{texts.ToVote}</VOTE>
            <img
              width="6"
              height="10"
              src={arrow}
              alt="vote"
            />
          </Buttons.ClickableText>
        </Component127371>
      )}
    </LighCart1>
  );
};

export default Card;
