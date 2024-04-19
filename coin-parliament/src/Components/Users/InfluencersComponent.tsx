/** @format */

import StatusNav from "./StatusNav";
import Leaderboard from "../Leaderboard";
import { UserProps } from "../../common/models/User";
import React, { useEffect, useRef } from "react";
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
  const scrollToTopRef = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    console.log("scrollToTop working")
    if (scrollToTopRef.current) {      
      // Use type assertion to assert that scrollToTopRef.current is of type HTMLElement
      (scrollToTopRef.current as HTMLElement).scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    // Scroll to top when the component mounts
    scrollToTop();
  }, []); // Empty dependency array means this effect runs only once, on component mount
  return (
    <React.Fragment>
      <div className='mb-4' ref={scrollToTopRef}>
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
      <p>TOP 25 {chosen}</p>
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
