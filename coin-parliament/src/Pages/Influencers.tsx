import React, {useContext, useEffect, useState} from "react";
import UserContext from "../Contexts/User";
import CoinsContext from "../Contexts/CoinsContext";
import {setChecked} from "../common/models/User";
import AppContext from "../Contexts/AppContext";
import InfluencersComponent from "../Components/Users/InfluencersComponent";

const Influencers = () => {
  const { user, userInfo } = useContext(UserContext);
  const { leaders } = useContext(CoinsContext);
  const { userTypes } = useContext(AppContext);
  const [chosen, setChosen] = useState<string | undefined>();
  const {chosenUserType,setChosenUserType}=useContext(AppContext)
  useEffect(() => {
    setChosen(chosenUserType)
    return () => {
      setChosen('')
      setChosenUserType('')
    }
  }, [chosenUserType])
  return (
    <div>
      <InfluencersComponent
        {...{
          userTypes,
          chosen,
          setChosen,
          leaders,
          userInfo,
          setChecked: setChecked(leaders, user),
        }}
      />
    </div>
  );
};

export default Influencers;
