import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import CoinContext from "../../Contexts/CoinsContext";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../../Contexts/User";
import {
  getData,
  getFilteredData,
  getFilteredDataByFav,
  getNumCardsPairs,
  getOffset,
  PairsRow,
} from "../../common/models/PairTable";
import { usePairs } from "./usePairs";
import { getChosenPairs } from "./utils";
import { User } from "firebase/auth";
import { useTranslation } from "../../common/models/Dictionary";
import { Input } from "../Atoms/Input/InputField.stories";
import { capitalize, upperCase } from "lodash";
import { Heart } from "../Atoms/Checkbox/Icon";
import { Buttons } from "../Atoms/Button/Button";
import Carousel from "./Carousel";
import styled from "styled-components";
import { useWindowSize } from "../../hooks/useWindowSize";
import { getMaxWidth } from "../Coins/Coins";
import { texts } from "../LoginComponent/texts";
import { ButtonToolbar } from "react-bootstrap";
import AppContext from "Contexts/AppContext";

const Container = styled.div`
  display: grid;
  
  grid-template-columns: ${(props: { width: number }) => props.width > 979 ? "373px 1fr 25px" : "25px 1fr 25px;"};
  align-items: center;
`;

const Toolbar = styled(ButtonToolbar)`
  flex-wrap: nowrap;
  overflow: scroll;
  background: #6352E8;
  padding: 12px;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Pairs = ({
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
  const { totals, allPairs, coins } = useContext(CoinContext);
  const { setLoginRedirectMessage, loginRedirectMessage, setLogin } = useContext(AppContext);
  const [filter, setFilter] = useState("");
  const { userInfo, user } = useContext(UserContext);
  const [chosenPairs, setChosenPairs] = useState<string[][] | undefined>(
    allPairs
  );
  const pairs = usePairs();
  const location = useLocation();
  const pathname = location.pathname;
  const [data, setData] = useState<PairsRow[]>(
    getData({ pairs: pairs(), totals })
  );
  const [filterByFav, setFilterByFav] = useState(false);
  const favorites = useMemo(() => userInfo?.favorites || [], [userInfo]);
  const [index, setIndex] = useState(0);
  const sound = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const newData = getFilteredData(filter, pairs(chosenPairs), totals);
    setData(newData);
  }, [chosenPairs, pairs, totals, filter]);

  useEffect(() => {
    const newPairs = getChosenPairs(allPairs, filter);
    setChosenPairs(newPairs);
  }, [filter, allPairs]);

  useEffect(() => {
    if (filterByFav) {
      setFilter("");
    }
    if (filterByFav) {
      const newData = getFilteredDataByFav(favorites, pairs(), totals);
      setData(newData);
    } else {
      if (!filter) {
        setData(getData({ pairs: pairs(), totals }));
      }
    }
  }, [filterByFav, filter, pairs, totals, favorites]);

  const maxWidth = useMemo(() => getMaxWidth(width), [width]);
  const src = require("../../assets/sounds/slide.mp3").default;

  return (
    <div id="PairsForm">
      {pathname == "/pairs" ? <>
        <h5 className="my-2 text-center">
          {/* {texts.WEBELIEVEINPARTNERSHIPS} */}
          <strong style={{ textTransform: 'uppercase', fontSize: "1.26rem" }}>{
            // texts.WhatYourPairVote
            "GET IN THE RING"
          }</strong>
        </h5>
        <audio className="d-none" ref={sound} autoPlay={false}>
          <source src={src} type="audio/mpeg" />
        </audio>
        <Toolbar>
          {expanded && (
            <>
              <div className="d-flex justify-content-center align-items-center m-auto">
                <div className="px-3"
                // style={{ position: 'relative' }}
                >
                  {/* <i className="bi bi-search" style={{position:'absolute',top:'9px',right:'30px',fontSize:'18px'}}></i> */}
                  <Input
                    style={{
                      background: "transparent",
                      color: "var(--white)",
                      width: `${window.screen.width > 767 ? "300px" : "200px"}`                      
                    }}
                    placeholder="Search.."
                    className="placeholderColor"
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value || ""); // Set undefined to remove the filter entirely
                    }}
                    // placeholder={capitalize(translate(`Search by symbol`))}
                    name="filter"
                    required
                  />
                </div>
                <div>
                  <Heart
                    checked={filterByFav}
                    setChecked={() => {

                      if (!user?.uid) {
                        setLoginRedirectMessage('add Pair to favorites')
                        setLogin(true)
                      }
                      if (user?.uid) {
                        setFilterByFav(!filterByFav);
                      }

                    }}
                    id="filterByFav"
                    name="filterByFav"
                    color="var(--white)"
                    size={24}
                  />
                </div>
              </div>
            </>
          )}
        </Toolbar>
      </> :
        ""
      }
      <div className="table-responsive m-auto overflow-hidden px-0" style={{ maxWidth }}>
        <Carousel
          {...{
            id: "Pairs",
            pairs: pairs(),
            index,
            setIndex: (i: number) => {
              setIndex(i);
              // sound.current?.play().then(void 0);
            },
            cols: getNumCardsPairs(width, expanded),
            offset: getOffset(width, expanded),
            gap: 9,
            coins,
            user,
            userInfo,
            data,
            onFavClick,
            expanded,
            navigate: (url) => navigate(url, { replace: true }),
          }}
        >
          {!expanded && (
            <Buttons.ClickableText
              onClick={() => {
                navigate("/pairs");
              }}
              style={{ color: "var(--white)", fontWeight: '400' }}
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

export default Pairs;
