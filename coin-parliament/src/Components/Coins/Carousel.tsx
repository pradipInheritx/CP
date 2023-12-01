/** @format */

import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Coin, swipeOptions } from "../../common/models/Coin";
import CoinsContext, { Totals } from "../../Contexts/CoinsContext";
import { UserProps } from "../../common/models/User";
import { User as AuthUser } from "@firebase/auth";
import {
  Column,
  Row,
  TableInstance,
  TableOptions,
  TableState,
  usePagination,
  UsePaginationInstanceProps,
  useTable,
} from "react-table";
import { BearVsBullRow } from "../../common/models/CoinTable";
import { Modify } from "../../common/utils/ts";
import { PaginationProps } from "../Pagination";
import Card from "./Card";
import { User } from "firebase/auth";
import styled from "styled-components";
import { useSwipeable } from "react-swipeable";
import { useWindowSize } from "../../hooks/useWindowSize";
import CPCarousel from "../Carousel/Carousel";
import AppContext from "../../Contexts/AppContext";
import { handleSoundClick } from "../../common/utils/SoundClick";
import { decimal } from "../Profile/utils";



export type CarouselProps = {
  expanded?: boolean;
  children?: React.ReactNode | string;
  coins: { [symbol: string]: Coin };
  totals: { [key: string]: Totals };
  userInfo?: UserProps;
  user?: AuthUser;
  navigate?: (url: string) => void;
  numRows?: number;
  data: BearVsBullRow[];
  onFavClick: (
    favorites: string[],
    user: User | undefined,
    id?: string
  ) => void;
  id?: string;
  index: number;
  setIndex: (i: number) => void;
  cols?: number;
  gap?: number;
};

interface GridProps {
  cols?: number;
  gap?: number;
}

const CardsContainer = styled.div`
  width: 100%;
  padding: 15px 0;
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

const IndicatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  align-content: stretch;
  padding: 15px;
`;

const ButtonContainer = styled.div`
  width: 60px;
  padding: 4px;
  position: absolute;
  bottom: -30px;
  right: 10px;
`;

const Indicator = styled.button`
  &[data-bs-target] {
    width: 8px;
    height: 8px;
    border-radius: 100%;
  }
`;

const Indicators = styled.div`
  flex: 1;
  margin: 0 auto;
  height: 56px;
  width: ${(props: { width?: number }) =>
    `${props.width && props.width < 979 ? "125px" : "100%"}`};
  align-items: center;
  flex-wrap: wrap;

  & .carousel-indicators [data-bs-target] {
    width: 8px;
    height: 8px;
    border-radius: 100%;
    background-color: var(--white);
  }
`;

const Carousel = ({
  expanded,
  coins,
  totals,
  user,
  userInfo,
  numRows = 3,
  data,
  navigate,
  onFavClick,
  id = "carousel",
  index,
  cols = 3,
  gap = 9,
  setIndex,
  children,
}: CarouselProps) => {
  const favorites = useMemo(() => userInfo?.favorites || [], [userInfo]);
  const [active, setActive] = useState(0);
  const { width } = useWindowSize();
  const { ws, socket, socketConnect } = useContext(CoinsContext);
  const [coinUpdated, setCoinUpdated] = useState<{ [symbol: string]: Coin }>(coins)
  const livePrice = useRef(coins)
  const columns: readonly Column<BearVsBullRow>[] = React.useMemo(
    () => [
      {
        Header: "Symbol",
        accessor: "symbol",
      },
    ],
    []
  );
  function updateCoin() {
    for (let obj in livePrice.current) {
      // Update the property value of prop1 in each object
      livePrice.current[obj].randomDecimal = (livePrice.current[obj]?.randomDecimal || 5) + (Math.random() < 0.5 ? -1 : 1)
    }
    // console.log('livepricedata',livePrice.current['BTC']?.randomDecimal,livePrice.current['BTC']?.price)
    setCoinUpdated(livePrice.current)
  }
  useEffect(() => {
    const interval = setInterval(function () {

      updateCoin()

    }, 1500);

    return () => {
      clearInterval(interval)
    }
  }, [])

  const instance: Modify<TableInstance<BearVsBullRow>, {}> =
    useTable<BearVsBullRow>(
      {
        columns,
        data,
        initialState: { pageIndex: 0 } as Partial<TableState<BearVsBullRow>>,
      } as unknown as TableOptions<BearVsBullRow>,
      usePagination
    );

  const { prepareRow, page, pageOptions, gotoPage, setPageSize } =
    instance as unknown as TableInstance<BearVsBullRow> &
    UsePaginationInstanceProps<BearVsBullRow> &
    PaginationProps & {
      page: Row<BearVsBullRow>[];
    };

  const handlers = useSwipeable(
    swipeOptions({
      index,
      setIndex,
      active,
      setActive,
      total: pageOptions?.length,
    })
  );
  const { setLoginRedirectMessage, loginRedirectMessage, setLogin } =
    useContext(AppContext);
  useEffect(() => {
    gotoPage(index);
  }, [index, data, gotoPage]);

  useEffect(() => {
    const pageData =
      numRows > 0 ? Math.min(numRows, data?.length) : data?.length;
    setPageSize(pageData ? pageData : 1);
  }, [setPageSize, numRows, data?.length]);

  useEffect(() => {
    if (!ws) return
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const symbol = message?.s?.slice(0, -4)      
      if (symbol) {

        // @ts-ignore
        const dot = decimal[symbol]
        // for (let obj in  livePrice.current) {
        //   // Update the property value of prop1 in each object
        //   livePrice.current[obj].randomDecimal = coinUpdated[obj]?.randomDecimal ||5 + Math.random()<5?1:1;
        // }

        // @ts-ignore

        // for (let obj in  livePrice.current) {
        //   // Update the property value of prop1 in each object
        //   livePrice.current[obj].randomDecimal = (livePrice.current[obj].randomDecimal ||5) + (Math.random()<5?1:1)
        // }
        livePrice.current = {
          ...livePrice.current,
          [symbol]: {
            ...livePrice.current[symbol],
            price: Number(message?.c).toFixed(dot?.decimal || 2),
            randomDecimal: Number(Number(message?.c).toFixed(dot?.decimal || 2)) == Number(livePrice.current[symbol]?.price) ? livePrice.current[symbol]?.randomDecimal : 5
          },
        }

        // setCoinUpdated((prevCoins) => ({
        //   ...prevCoins,
        //   [symbol]: {
        //     ...prevCoins[symbol],
        //     price:Number(message?.c).toFixed(dot?.decimal || 2), 
        //   },
        // }));
      }
    };
  }, [ws, socketConnect])
  // console.log('liveprice',livePrice?.current?.BTC?.randomDecimal)
  useEffect(() => {
    if (!socket) return
    socket.onmessage = (event) => {

      const data = JSON.parse(event.data);
      const dot = decimal["CRO"]
      // console.log('cro price',data?.result?.data[0])
      if (data?.result?.data[0].a) {
        // @ts-ignore
        livePrice.current = {
          ...livePrice.current,
          ['CRO']: {
            ...livePrice.current['CRO'],
            // @ts-ignore
            price: Number(data?.result?.data[0]?.a).toFixed(dot?.decimal || 2),
            randomDecimal: 5
          },
        }
        // setCoinUpdated((prevCoins) => ({
        //   ...prevCoins,
        //   ['CRO']: {
        //     ...prevCoins['CRO'],
        //     price: Number(data?.result?.data[0]?.a).toFixed(dot?.decimal || 2),
        //   },
        // }));
      }
    };

  }, [socket, socketConnect])

  return expanded === false ? (
    <form
      id={id}
      className='carousel slide HelloSlide'
      data-bs-ride='carousel'
      onSubmit={(e) => e.preventDefault()}
    >
      <CPCarousel
        coin={!(window.screen.width && window.screen.width > 969)}
        items={window.screen.width && window.screen.width > 969 ? 6 : 3}
        cursorShow={true}
      >
        {Object.keys(coins)
          ?.sort()
          ?.map((key, i) => {
            const { symbol } = coins[key];
            return (
              <div className='m-1' key={i}>
                <Card
                  // key={i}
                  favorite={favorites.includes(symbol)}
                  setFavorite={() => {
                    onFavClick(favorites, user);
                    setIndex(index);
                  }}
                  symbol={symbol}
                  coins={livePrice.current}
                  totals={totals}
                  onClick={() => {
                    const url = "/coins/" + symbol;
                    if (navigate) {
                      navigate(url);
                      handleSoundClick()
                    }
                  }}
                />
              </div>
            );
          })}
      </CPCarousel>
      <ButtonContainer>{children}</ButtonContainer>
    </form>
  ) : (
    <form id={id} className='carousel slide' data-bs-ride='carousel'>
      <div className='carousel-inner'>
        <div className='carousel-item active'>
          <CardsContainer cols={cols} gap={gap} {...handlers}>
            {page.length > 0 &&
              page.slice(0, page.length).map((row: Row<BearVsBullRow>, i: number) => {
                prepareRow(row);
                return (
                  <div {...row.getRowProps()} className='d-flex' key={i}>
                    {row.cells.map((cell, j) => {
                      const symbol = cell.value;

                      return (
                        <div {...cell.getCellProps()} className='w-100' key={j}>
                          {cell.column.id === "symbol" ? (
                            <Card
                              // key={i}
                              favorite={favorites.includes(symbol)}
                              setFavorite={() => {
                                onFavClick(favorites, user);
                                setIndex(index);
                              }}
                              symbol={symbol}
                              coins={livePrice.current}
                              totals={totals}
                              onClick={() => {
                                const url = "/coins/" + symbol;
                                if (navigate) {
                                  navigate(url);
                                  handleSoundClick()
                                }
                              }}
                            />
                          ) : (
                            cell.render("Cell")
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
          </CardsContainer>
        </div>
      </div>

      {pageOptions?.length > 1 && (
        <IndicatorContainer>
          <Indicators className='carousel-indicators' width={width}>
            {pageOptions?.map((o) => (
              <Indicator
                key={o}
                type='button'
                data-bs-target={`#${id}`}
                data-bs-slide-to={o}
                className={o === index ? "active" : ""}
                aria-current={o === index ? "true" : "false"}
                aria-label={`Slide ${o}`}
                onClick={() => {
                  setIndex(o);
                  if (active === 2) {
                    setActive(0);
                  } else {
                    setActive(active + 1);
                  }
                }}
                data-bs-slide='next'
              />
            ))}
          </Indicators>
          <ButtonContainer>{children}</ButtonContainer>
        </IndicatorContainer>
      )}
    </form>
  );
};

export default Carousel;
