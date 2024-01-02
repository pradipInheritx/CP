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
// console.log(leaders ,"leaderscheck")
  return (
    <div>
      <LeadersContainer>
        {leaders?.sort((a, b) => b.score- a.score)
          ?.map((leader) => {
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
              key={leader.userId}
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
      </LeadersContainer>
    </div>
  );
};

export default Leaderboard;
