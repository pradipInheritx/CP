import React from "react";
import { AdminManager } from "../common/models/AdminManager";
import { CPMSettings, VoteRules } from "./AppContext";
import { TimeFrame } from "../common/models/Vote";
import { UserTypeProps } from "../common/models/UserType";

export type ManagersContextProps = {
  CPMSettingsMng: AdminManager<CPMSettings>;
  VoteRulesMng: AdminManager<VoteRules>;
  TimeframesMng: AdminManager<TimeFrame[]>;
  UserTypeMng: AdminManager<UserTypeProps[]>;
};

const ManagersContext = React.createContext({} as ManagersContextProps);

export default ManagersContext;

ManagersContext.displayName = "Managers";
