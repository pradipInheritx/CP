import React from "react";
import {useTranslation} from "../common/models/Dictionary";

const Spinner = () => {
  const translate = useTranslation();
  return (
    <React.Fragment>
      <div className="tada m-2">{translate("Wait for it")}</div>
    </React.Fragment>
  );
};

export default Spinner;
