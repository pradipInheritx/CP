/** @format */

import React, { useContext, useState } from "react";

import { toFollow, UserProps } from "../../common/models/User";
import UserCard from "./UserCard";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AppContext from "Contexts/AppContext";
import UserContext from "Contexts/User";
import { Leader } from "Contexts/CoinsContext";
import Button from "Components/Atoms/Button/Button";

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
  const { setLoginRedirectMessage, setLogin, setChosenUserType } = useContext(AppContext);
  const { user } = useContext(UserContext);
  const [currentPage, setCurrentPage] = useState(1);  
  const itemsPerPage = 5
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  let { type } = useParams();
  
  const nextPage = () => setCurrentPage(prev => prev + 1);
  const prevPage = () => setCurrentPage(prev => prev - 1);

  // @ts-ignore
  const myUserIndex = userInfo?.uid && leaders?.sort((a, b) => (b?.influencersScore) - (a?.influencersScore)).findIndex(obj => obj.userId === userInfo?.uid) || 0;
  console.log(myUserIndex, leaders, "myUserIndex")
  const EndIndex = 10;
  const navigate = useNavigate();
  // @ts-ignore
  // console.log(leaders, "leaderscheck")
  return (
    <div>
      <LeadersContainer>
        <p className="mb-2"
          style={{
            cursor:"pointer"
          }}
          onClick={() => {
            setChosenUserType(`${type}`)
            navigate(`/influencers`)
        }}
        >BACK TO TOP 10</p>
{/* @ts-ignore */}
        {leaders?.slice(indexOfFirstItem, indexOfLastItem).sort((a, b) => (b?.influencersScore) - (a?.influencersScore))
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
        <div>
          <div className="d-flex mb-3">
            <Button onClick={prevPage} disabled={currentPage === 1}
              style={{
              marginRight:"10px"
            }}
            >
            PREV
          </Button>
          
            <Button onClick={nextPage} disabled={indexOfLastItem >= leaders.length}
              style={{
                marginLeft: "10px"
              }}
            >
            NEXT
          </Button>
          </div>
        </div>
      </LeadersContainer>
    </div>
  );
};

export default Leaderboard;
