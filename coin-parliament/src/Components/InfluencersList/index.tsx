import React, { useContext, useEffect, useState } from "react";



import { texts } from "Components/LoginComponent/texts";
import AppContext from "Contexts/AppContext";
import InfluencersComponent from "./InfluencersComponent";
import UserContext from "Contexts/User";
import CoinsContext from "Contexts/CoinsContext";
import { setChecked } from "common/models/User";
import { useParams } from "react-router-dom";

const InfluencersList = () => {
  const { user, userInfo } = useContext(UserContext);
  const { leaders } = useContext(CoinsContext);
  let { type } = useParams();
  const { userTypes } = useContext(AppContext);
  const [chosen, setChosen] = useState<string | undefined>(type);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { chosenUserType, setChosenUserType } = useContext(AppContext);
  
  
  console.log(type,"pathtype")
  useEffect(() => {
    // setChosen(chosenUserType || "SPEAKER")
    setChosen(type)
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
          // userTypes=[`${type}`],
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

export default InfluencersList;
