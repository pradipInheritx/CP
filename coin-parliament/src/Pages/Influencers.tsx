import React, { useContext, useEffect, useState } from "react";
import UserContext from "../Contexts/User";
import CoinsContext from "../Contexts/CoinsContext";
import { setChecked } from "../common/models/User";
import AppContext from "../Contexts/AppContext";
import InfluencersComponent from "../Components/Users/InfluencersComponent";
import { texts } from "Components/LoginComponent/texts";

const Influencers = () => {
  const { user, userInfo } = useContext(UserContext);
  const { leaders } = useContext(CoinsContext);
  const { userTypes } = useContext(AppContext);
  const [chosen, setChosen] = useState<string | undefined>("SPEAKER");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { chosenUserType, setChosenUserType } = useContext(AppContext);

  console.log(chosenUserType,"chosenUserType")
  useEffect(() => {
    // setChosen(chosenUserType || "SPEAKER")
    setChosen(chosenUserType.toUpperCase() || userTypes[0]?.name.toUpperCase() || "SPEAKER")
    return () => {
      setChosen('')
      setChosenUserType('')
    }
  }, [/* chosenUserType */userTypes])
  // @ts-ignore
// console.log(isLoading,"leaderslist")
  console.log(isLoading,"isLoading")

  return (
    <div>

      {isLoading && <div style={{
        position: 'fixed',
        height: '85%',
        // border: "2px solid red",
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.5)',
        // top: '0px',
        right: '0px',
        bottom: '0px',
        zIndex: '9999',
        overflow: 'hidden',
        width: '100%',
        // alignItems: 'center',

      }}>
        <span className="loading" style={{
        // border:"1px solid green",
          color: "white", zIndex: "2220px", fontSize: '1.5em',
          marginTop: "70px"
        }}>
          {texts.waitForIt}
        </span>
      </div>}

      <InfluencersComponent
        {...{
          userTypes,
          chosen,
          setChosen,
          leaders,
          userInfo,
          setChecked: setChecked(leaders, user, setIsLoading),
        }}
      />
    </div>
  );
};

export default Influencers;
