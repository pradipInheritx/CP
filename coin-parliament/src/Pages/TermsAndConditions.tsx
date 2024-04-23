import React, { useEffect } from "react";
import {Link} from "react-router-dom";
import { TermsAndCondition } from "../common/consts/contents";
import GeneralPage from "../GeneralPage";

const TermsAndConditions = () => {
  return (
    <GeneralPage>
      <h1>Terms & Conditions</h1>
      <div
      dangerouslySetInnerHTML={{__html: TermsAndCondition}}
    />
    </GeneralPage>
  );
};

export default TermsAndConditions;
