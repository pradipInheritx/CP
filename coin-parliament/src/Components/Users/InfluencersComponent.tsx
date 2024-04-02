/** @format */

import StatusNav from "./StatusNav";
import Leaderboard from "../Leaderboard";
import { UserProps } from "../../common/models/User";
import React from "react";
import { UserTypeProps } from "../../common/models/UserType";
import { Leader } from "../../Contexts/CoinsContext";

export type InfluencersComponentProps = {
  userTypes: UserTypeProps[];
  setChosen: (c?: string) => void;
  chosen?: string;
  leaders: Leader[];
  userInfo?: UserProps;
  setChecked: (userId: string, check: boolean) => void;
};

const InfluencersComponent = ({
  userTypes,
  chosen,
  setChosen,
  leaders,
  userInfo,
  setChecked,
}: InfluencersComponentProps) => {

  return (
    <React.Fragment>
      <div className='mb-4'>
        <div className="d-flex justify-content-center my-2 px-2 text-center">
          <h5 className="">            
            <strong style={{ textTransform: 'uppercase', fontSize: "1.26rem" }}>Who doesn’t want to be heard?</strong>
          </h5>
        </div>
        <StatusNav

          userTypes={userTypes
            .sort((a, b) => b.index - a.index)
            .map((u) => u.name.toUpperCase())}
          setChosen={setChosen}
          chosen={chosen}
        />
      </div>
      <div className="text-center mb-2">
      <p>TOP 10 {chosen}</p>
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
