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
        <StatusNav
        
          userTypes={userTypes
            .sort((a, b) => a.index - b.index)
            .map((u) => u.name.toUpperCase())}
          setChosen={setChosen}
          chosen={chosen}
        />
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
