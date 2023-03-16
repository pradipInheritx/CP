import React, { useEffect } from "react";
import {Link} from "react-router-dom";
import { privacy } from "../common/consts/contents";
import GeneralPage from "../GeneralPage";

const PrivacyPolicy = () => {
//     useEffect(() => {
//       window.scrollTo(0, 0)
//       console.log("hello I am ");
//       return window.scrollTo(0, 0)
// }, [])
  return (
    <GeneralPage>
      <h1>Privacy Policy</h1>
      <div
      dangerouslySetInnerHTML={{__html: privacy}}
    />
    </GeneralPage>
  );
};

export default PrivacyPolicy;
