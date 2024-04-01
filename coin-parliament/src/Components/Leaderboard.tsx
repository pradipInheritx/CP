/** @format */

import React, { useContext } from "react";
import { Leader } from "../Contexts/CoinsContext";
import { toFollow, UserProps } from "../common/models/User";
import UserCard from "./Users/UserCard";
import styled from "styled-components";
import { useLocation } from "react-router-dom";
import AppContext from "Contexts/AppContext";
import UserContext from "Contexts/User";

const LeaderItem = styled.div``;

const LeadersContainer = styled.div`
  max-width: 729px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media(max-width: 1000px) {
    max-width: 729px;
    // width: 68%;
    align-items: center;
    flex-direction: column;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
	}
`;
const Leaderboard = ({
  leaders,
  userInfo,
  viewAllLink,
  setChecked,
  expanded,
}: {
  expanded?: boolean;
  leaders: Leader[];
  viewAllLink?: string;
  userInfo?: UserProps;
  setChecked: (userId: string, check: boolean) => void;
}) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { setLoginRedirectMessage, setLogin } = useContext(AppContext);
  const { user } = useContext(UserContext);
  
  // @ts-ignore
  const myUserIndex = userInfo?.uid && leaders?.sort((a, b) => (b?.influencersScore) - (a?.influencersScore)).findIndex(obj => obj.userId === userInfo?.uid) || 0;
  console.log(myUserIndex, leaders, "myUserIndex")
  const EndIndex = 10;
  // @ts-ignore
  // console.log(leaders, "leaderscheck")
  return (
    <div>
      <LeadersContainer>
{/* @ts-ignore */}
        {leaders?.slice(0, EndIndex).sort((a, b) => (b?.influencersScore) - (a?.influencersScore))
          ?.map((leader ,index) => {
          const checked = !toFollow(userInfo?.leader || [], leader?.userId);
          return (
            <LeaderItem
              style={{
                width:
                  window.screen.width < 979 &&
                    pathname?.includes("/influencers")
                    ? "321px"
                    : "100%",
                padding: "0 0 12px 0",
              }}
              key={index}
            >
              <UserCard
                expanded={expanded}
                leader={leader}
                checked={checked}
                setChecked={() => {
                  if (!user) {
                    setLoginRedirectMessage('follow influencer');
                    setLogin(true);
                  } else {
                    setChecked(leader.userId, !checked);
                  }
                }}
                viewAllLink={viewAllLink}
              />
            </LeaderItem>
          );
          })}
        {userInfo?.uid && myUserIndex > EndIndex && <>
          <LeaderItem
            style={{
              width:
                window.screen.width < 979 &&
                  pathname?.includes("/influencers")
                  ? "321px"
                  : "100%",
              padding: "0 0 12px 0",
            }}            
          >
            <UserCard
              expanded={expanded}
              leader={leaders[myUserIndex]}
              checked={false}
              setChecked={() => {
                if (!user) {
                  setLoginRedirectMessage('follow influencer');
                  setLogin(true);
                } else {
                  setChecked(leaders[myUserIndex].userId, false);
                }
              }}
              viewAllLink={viewAllLink}
            />
          </LeaderItem>
          
        </>}

      </LeadersContainer>
    </div>
  );
};

export default Leaderboard;
