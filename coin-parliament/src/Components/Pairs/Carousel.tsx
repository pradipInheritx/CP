import React, {useContext, useMemo, useState} from "react";
import {Coin, swipeOptions} from "../../common/models/Coin";
import {UserProps} from "../../common/models/User";
import {User as AuthUser} from "@firebase/auth";
import Card from "./Card";
import {User} from "firebase/auth";
import styled from "styled-components";
import {PairsRow} from "../../common/models/PairTable";
import {symbolCombination} from "./utils";
import CardsContainer from "./CardContainer";
import {useSwipeable} from "react-swipeable";
import {useWindowSize} from "../../hooks/useWindowSize";
import CPCarousel from "../Carousel/Carousel";
import CoinsContext from "../../Contexts/CoinsContext";

export type CarouselProps = {
  children?: React.ReactNode | string;
  pairs: Coin[][];
  userInfo?: UserProps;
  user?: AuthUser;
  navigate?: (url: string) => void;
  data: PairsRow[];
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
  offset?: number;
  expanded?: boolean;
};

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

const PairCard = styled.div`
`;

const Indicators = styled.div`
  flex: 1;
  margin: 0 auto;
  height: 56px;
  max-width: 100%;
  width: ${(props: { width?: number }) => `${props.width && props.width < 979 ? "125px" : "50vw"}`};
  flex-wrap: wrap;

  & .carousel-indicators [data-bs-target] {
    width: 8px;
    height: 8px;
    border-radius: 100%;
  }
`;

const getThreePairs = (pairs: Coin[][], i: number) => {
  let prev = i - 1,
    next = i + 1;
  if (i === 0) {
    prev = prev + pairs.length;
  }
  if (next === pairs.length) {
    next = 0;
  }
  return { prev: pairs[prev], current: pairs[i], next: pairs[next] };
};
const Carousel = ({
  pairs,
  user,
  userInfo,
  data,
  navigate,
  onFavClick,
  id = "carousel",
  index,
  setIndex,
  cols = 3,
  gap = 9,
  offset = 0,
  expanded,
  children,
}: CarouselProps) => {
  const favorites = useMemo(() => userInfo?.favorites || [], [userInfo]);
  const {coins} = useContext(CoinsContext);
  const [active, setActive] = useState(0);
  const {width} = useWindowSize();
  const handlers = useSwipeable(
    swipeOptions({
      index,
      setIndex,
      active,
      setActive,
      total: pairs.length,
    }),
  );

  return !expanded ? (
    <form id={id} className="carousel slide " data-bs-ride="carousel" onSubmit={e => e.preventDefault()}>
      <CPCarousel centerMode={!(window.screen.width && window.screen.width > 969)}>{
        Object.keys(pairs).map((pair, i) => {
          const {current} = getThreePairs(pairs, i);
          const [coin1, coin2] = current;
          const combination = symbolCombination([
            coin1.symbol,
            coin2.symbol,
          ]);
          return (
            <div className='mx-1'>
            <Card
            
              key={i}
              coins={coins}
              favorite={favorites.includes(combination)}
              setFavorite={() => {
                onFavClick(favorites, user, id);
                setIndex(index);
              }}
              coin1={coin1}
              coin2={coin2}
              onClick={() => {
                const url = "/pairs/" + combination;
                if (navigate) {
                  navigate(url);
                }
              }}
            />
            </div>
          );
        })
      }</CPCarousel>
      <ButtonContainer>{children}</ButtonContainer>
    </form>
  ) : (
    <form id={id} className="carousel slide " data-bs-ride="carousel">
      <div className="carousel-inner">
        {pairs.map((pair, i) => {
          const {prev, current, next} = getThreePairs(pairs, i);
          const arr = expanded
            ? data.map((el) => {
              return pairs.find((p) => {
                const [c1, c2] = p;
                return (
                  (c1.symbol === el.coin1 && c2.symbol === el.coin2) ||
                  (c2.symbol === el.coin1 && c1.symbol === el.coin2)
                );
              });
            })
            : [prev, current, next];
          return i === active ? (
            <div
              className={`carousel-item ${i === active ? "active" : ""}`}
              key={i}
            >
              <CardsContainer
                cols={cols}
                gap={gap}
                offset={offset}
                {...handlers}
              >
                {arr.map((pair, j) => {
                  const [coin1, coin2] = pair || [];
                  const combination = symbolCombination([
                    coin1.symbol,
                    coin2.symbol,
                  ]);

                  return (
                    <div className="d-flex px-1" key={j}>
                      <PairCard className="w-100">
                        <Card
                          favorite={favorites.includes(combination)}
                          setFavorite={() => {
                            onFavClick(favorites, user, id);
                            setIndex(index);
                          }}
                          coins={coins}
                          coin1={coin1}
                          coin2={coin2}
                          onClick={() => {
                            const url = "/pairs/" + combination;
                            if (navigate) {
                              navigate(url);
                            }
                          }}
                        />
                      </PairCard>
                    </div>
                  );
                })}
              </CardsContainer>
            </div>
          ) : null;
        })}
      </div>

      {!expanded && data.length > 1 && (
        <IndicatorContainer>
          <Indicators className="carousel-indicators" width={width}>
            {pairs.map((pair, o) => (
              <Indicator
                key={o}
                type="button"
                data-bs-target={`#${id}`}
                data-bs-slide-to={o}
                className={o === index ? "active" : ""}
                aria-current={o === index ? "true" : "false"}
                aria-label={`Slide ${o}`}
                onClick={() => {
                  setIndex(o);
                  setActive(o);
                }}
                data-bs-slide="next"
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
