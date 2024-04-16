import React from "react";
import { useTranslation } from "../common/models/Dictionary";
import BigLogo from "../assets/svg/logoiconx2.svg";
const Spinner = () => {
  const translate = useTranslation();
  return (
    <React.Fragment>
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ height: "100vh", width: "100vw", color: "white" }}
      >

        <div className="tada m-2">{translate("Wait for it".toUpperCase())}</div>
      </div>
      {/* <div className="tada m-2"> <img src={BigLogo}></img></div> */}
    </React.Fragment>
  );
};

export default Spinner;
