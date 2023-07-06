import React, { useContext, useEffect, useState } from "react";
import UserContext from "../Contexts/User";
import CoinsContext from "../Contexts/CoinsContext";
import { setChecked } from "../common/models/User";
import AppContext from "../Contexts/AppContext";
import InfluencersComponent from "../Components/Users/InfluencersComponent";

const Influencers = () => {
  const { user, userInfo } = useContext(UserContext);
  const { leaders } = useContext(CoinsContext);
  const { userTypes } = useContext(AppContext);
  const [chosen, setChosen] = useState<string | undefined>("SPEAKER");
  const { chosenUserType, setChosenUserType } = useContext(AppContext);
  useEffect(() => {
    // setChosen(chosenUserType || "SPEAKER")
    setChosen(userTypes[0]?.name.toUpperCase() || "SPEAKER")
    return () => {
      setChosen('')
      setChosenUserType('')
    }
  }, [/* chosenUserType */userTypes])
  // @ts-ignore
console.log(leaders,"leaderslist")

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
