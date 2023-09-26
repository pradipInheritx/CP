import React from "react";
import { useTranslation } from "../common/models/Dictionary";
import BigLogo from "../assets/svg/logoiconx2.png";
const Spinner = () => {
  const translate = useTranslation();
  return (
    <React.Fragment>
      <div className="tada m-2">{translate("Wait for it").toUpperCase()}</div>
      {/* <div className="tada m-2"> <img src={BigLogo}></img></div> */}
    </React.Fragment>
  );
};

export default Spinner;
