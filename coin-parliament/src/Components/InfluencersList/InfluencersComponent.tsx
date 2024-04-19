/** @format */


import Leaderboard from "./Leaderboard";
import { UserProps } from "../../common/models/User";
import React from "react";
import { UserTypeProps } from "../../common/models/UserType";
import { Leader } from "../../Contexts/CoinsContext";
import StatusNav from "./StatusNav";
import { useParams } from "react-router-dom";

export type InfluencersComponentProps = {
  // userTypes: UserTypeProps[];
  setChosen: (c?: string) => void;
  chosen?: string;
  leaders: Leader[];
  userInfo?: UserProps;
  setChecked: (userId: string, check: boolean) => void;
};

const InfluencersComponent = ({
  // userTypes,
  chosen,
  setChosen,
  leaders,
  userInfo,
  setChecked,
}: InfluencersComponentProps) => {

  let { type } = useParams();

  return (
    <React.Fragment>
      <div className='mb-4'>
        <div className="d-flex justify-content-center my-2 px-2 text-center">
          <h5 className="">            
            <strong style={{ textTransform: 'uppercase', fontSize: "1.26rem" }}>Who doesn’t want to be heard?</strong>
          </h5>
        </div>
        <StatusNav
          userTypes={[`${type?.toLocaleUpperCase()}`]}
          setChosen={setChosen}
          chosen={`${type?.toLocaleUpperCase()}`}
        />
      </div>
      <div className="text-center mb-2">
      {/* <p>TOP 239208 {chosen}</p> */}
      </div>
      <Leaderboard
        {...{
          expanded: true,
          leaders: leaders.filter((leader) => {
            return (
              leader.status?.toLowerCase() === chosen?.toLowerCase() || !chosen
            );
          }),
          userInfo,
          setChecked,
        }}
      />
    </React.Fragment>
  );
};

export default InfluencersComponent;
