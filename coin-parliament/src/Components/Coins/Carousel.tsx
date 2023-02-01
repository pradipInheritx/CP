/** @format */

import React, { useContext, useEffect, useMemo, useState } from "react";
import { Coin, swipeOptions } from "../../common/models/Coin";
import { Totals } from "../../Contexts/CoinsContext";
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
import SwiperBar from "../Carousel/SwiperBar";
import "./Slider.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const columns: readonly Column<BearVsBullRow>[] = React.useMemo(
    () => [
      {
        Header: "Symbol",
        accessor: "symbol",
      },
    ],
    []
  );

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
  console.log("data", Object.keys(coins).sort());
  return expanded === false ? (
    <form
      id={id}
      className='carousel slide HelloSlide'
      data-bs-ride='carousel'
      onSubmit={(e) => e.preventDefault()}
      
    >
      <SwiperBar
        
      >
        {Object.keys(coins)
          ?.sort()
          ?.map((key, i) => {
            const { symbol } = coins[key];
            return (
              <div className='m-1'>
                <Card
                  key={i}
                  favorite={favorites.includes(symbol)}
                  setFavorite={() => {
                    onFavClick(favorites, user);
                    setIndex(index);
                  }}
                  symbol={symbol}
                  coins={coins}
                  totals={totals}
                  onClick={() => {
                    const url = "/coins/" + symbol;
                    if (navigate) {
                      navigate(url);
                    }
                  }}
                />
              </div>
            );
          })}
      </SwiperBar>
        {/* {Object.keys(coins)
          ?.sort()
          ?.map((key, i) => {
            const { symbol } = coins[key];
            return (
              <div className='m-1'>
                <Card
                  key={i}
                  favorite={favorites.includes(symbol)}
                  setFavorite={() => {
                    onFavClick(favorites, user);
                    setIndex(index);
                  }}
                  symbol={symbol}
                  coins={coins}
                  totals={totals}
                  onClick={() => {
                    const url = "/coins/" + symbol;
                    if (navigate) {
                      navigate(url);
                    }
                  }}
                />
              </div>
            );
          })}
      </CPCarousel> */}
      <ButtonContainer>{children}</ButtonContainer>
    </form>
  ) : (
    <form id={id} className='carousel slide' data-bs-ride='carousel'>
      <div className='carousel-inner'>
        <div className='carousel-item active'>
          <CardsContainer cols={cols} gap={gap} {...handlers}>
            {page.length > 0 &&
              page.slice(0, page.length).map((row: Row<BearVsBullRow>) => {
                prepareRow(row);
                return (
                  <div {...row.getRowProps()} className='d-flex'>
                    {row.cells.map((cell, j) => {
                      const symbol = cell.value;

                      return (
                        <div {...cell.getCellProps()} className='w-100' key={j}>
                          {cell.column.id === "symbol" ? (
                            <Card
                              favorite={favorites.includes(symbol)}
                              setFavorite={() => {
                                onFavClick(favorites, user);
                                setIndex(index);
                              }}
                              symbol={symbol}
                              coins={coins}
                              totals={totals}
                              onClick={() => {
                                const url = "/coins/" + symbol;
                                if (navigate) {
                                  navigate(url);
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
