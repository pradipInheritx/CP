/** @format */

import React, { useContext, useEffect, useMemo, useState } from "react";
import CoinContext from "../../Contexts/CoinsContext";
import UserContext from "../../Contexts/User";
import {
  BearVsBullRow,
  getData,
  getFilteredData,
  getFilteredDataByFav,
} from "../../common/models/CoinTable";
import { getNumCards, getNumRows } from "../../common/models/PairTable";
import { User } from "firebase/auth";
import Carousel from "../Coins/Carousel";
import { upperCase } from "lodash";
import { useTranslation } from "../../common/models/Dictionary";
import { Heart } from "../Atoms/Checkbox/Icon";
import { Buttons } from "../Atoms/Button/Button";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useWindowSize } from "../../hooks/useWindowSize";
import { Input } from "../Atoms/styles";
import CoinsContext from "../../Contexts/CoinsContext";
import { texts } from "../LoginComponent/texts";

const Container = styled.div`
  display: grid;

  grid-template-columns: ${(props: { width: number }) =>
    props.width > 979 ? "373px 1fr 15px" : "15px 1fr 15px"};
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: ${(props: { width: number }) =>
    props.width > 979 ? "759px" : "312px"};
`;

export const getMaxWidth = (width?: number) =>
  width && width > 979 ? 729 : undefined;

const Coins = ({
  expanded = false,
  onFavClick,
}: {
  expanded?: boolean;
  onFavClick: (
    favorites: string[],
    user: User | undefined,
    id?: string
  ) => void;
}) => {
  const { width = 0 } = useWindowSize();
  const translate = useTranslation();
  let navigate = useNavigate();
  const { coins, totals, allCoins } = useContext(CoinContext);
  const { userInfo, user } = useContext(UserContext);
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<BearVsBullRow[]>(
    getData({ coins, totals, allCoins })
  );
  const [filterByFav, setFilterByFav] = useState(false);
  const [filter, setFilter] = useState<string>("");
  const numRows = useMemo(
    () => (expanded ? getNumRows(expanded) : getNumCards(width)),
    [expanded, width]
  );
  const favorites = useMemo(() => userInfo?.favorites || [], [userInfo]);
            // const { changePrice, setChangePrice } = useContext(CoinsContext);

  useEffect(() => {
    setData(getFilteredData(filter, coins, totals, allCoins));
  }, [filter, coins, totals, allCoins]);
 
  useEffect(() => {
    if (filterByFav) {
      setFilter("");
    }
    if (filterByFav) {
      setData(getFilteredDataByFav(favorites, coins, totals, allCoins));
    } else {
      if (!filter) {
        setData(getData({ coins, totals, allCoins }));
      }
    }
  }, [filterByFav, filter, coins, totals, favorites, allCoins]);

  const maxWidth = useMemo(() => getMaxWidth(width), [width]);

  return (
    <div className='d-flex flex-column justify-content-center align-items-center py-3 '>
      {expanded && (
        <Container
          {...{ width }}
          style={{ margin: width > 979 ? "20px 0 50px 0" : '"0 -15px' }}
        >
          {width > 979 ? (
            <div
              style={{
                fontSize: "20px",
                fontWeight: "400",
                marginLeft: "20px",
              }}
            >
              {/* {("What's Your Coin Vote ?").toUpperCase()} */}
              {texts.WhatYourCoinVote}
            </div>
          ) : (
            <div />
          )}

          <div className='px-1' style={{ position: "relative" }}>
            <i
              className='bi bi-search'
              style={{
                position: "absolute",
                top: "9px",
                right: "20px",
                fontSize: "18px",
              }}
            ></i>
            <Input
              style={{
                background: "transparent",
                color: "var(--white)",
              }}
              value={filter}
              onChange={(e: { target: { value: string } }) => {
                setFilter(e.target.value || ""); // Set undefined to remove the filter entirely
              }}
              name='filter'
              required
            />
          </div>

          <div style={{ marginLeft: "10px" }}>
            <Heart
              checked={filterByFav}
              setChecked={() => {
                setFilterByFav(!filterByFav);
              }}
              // color="var(--white)"
              id='filterByFav'
              name='filterByFav'
              size={24}
            />
          </div>

      {/* <button onClick={()=>setChangePrice(changePrice + 1)}>Click me</button> */}
        </Container>
      )}
      <div className='px-0 m-auto w-100' style={{ maxWidth }}>
        <Carousel
          {...{
            expanded,
            id: "BearVsBull",
            index,
            setIndex: (i: number) => {
              setIndex(i);
              // sound.current?.play().then(void 0);
            },
            numRows,
            cols: getNumCards(width, expanded),
            gap: 9,
            coins,
            totals,
            user,
            userInfo,
            data,
            onFavClick,
            navigate: (url) => navigate(url, { replace: true }),
          }}
        >
          {!expanded && (
            <Buttons.ClickableText
              onClick={() => {
                navigate("/coins");
              }}
              style={{ color: "var(--white)", fontWeight: "400" }}
            >
              {/* {upperCase(translate("view all"))} */}
              {texts.ViewAll}
            </Buttons.ClickableText>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default Coins;
