import React, {useContext, useEffect, useState} from "react";
import {Tab, Tabs} from "react-bootstrap";
import VoteRules from "../Components/Admin/VoteRules";
import CPMSettings from "../Components/Admin/CPMSettings";
import UserContext, {getUserInfo} from "../Contexts/User";
import {Navigate, useLocation} from "react-router-dom";
import {UserProps} from "../common/models/User";
import AdminDictionary from "../Components/Admin/Dictionary";
import Coins from "../Components/Admin/Coins";
import Pairs from "../Components/Admin/Pairs";

const Admin = () => {
  const {user, admin} = useContext(UserContext);
  const [userInfo, setUserInfo] = useState<UserProps>({} as UserProps);
  const [mounted, setMounted] = useState(false);

  const location = useLocation();
  useEffect(() => {
    getUserInfo(user).then((info) => {
      setUserInfo(info);
      setMounted(true);
    });       
  }, [user]);

  if (mounted) {
    if (Object.keys(userInfo).length) {
      if (admin === false) {
        return (
          <Navigate
            to="/"
            state={{
              from: location,
            }}
          />
        );
      }

      if (user && admin) {
        return (
          <>
            <Tabs
              defaultActiveKey="vote_rules"
              id="admin-tabs"
              className="mb-3"
              mountOnEnter={true}
              unmountOnExit={true}
            >
              <Tab eventKey="vote_rules" title="Vote rules">
                <VoteRules />
              </Tab>
              <Tab eventKey="CPM_setting" title="CPM setting">
                <CPMSettings />
              </Tab>
              <Tab eventKey="dictionary" title="Dictionary">
                <AdminDictionary/>
              </Tab>
              <Tab eventKey="coins" title="Coins">
                <Coins/>
              </Tab>
              <Tab eventKey="pairs" title="Pairs">
                <Pairs/>
              </Tab>
              {/* <Tab eventKey="avatars" title="Avatars"> */}
              {/*   <Avatars /> */}
              {/* </Tab> */}
            </Tabs>
          </>
        );
      }
    }
  }
  return <></>;
};

export default Admin;
