import React from "react";
import {Redirect, Route, Switch} from "react-router";
import Dashboards from "./Dashboards";
import Components from "./Components";
import Apps from "./Apps";
import Extensions from "./Extensions";
import Charts from "./Charts";
import Maps from "./Maps";
import Widgets from "./Widgets";
import Metrics from "./Metrics";
import Login from "./Auth/Login";
import Signup from "./Auth/Register";
import ForgotPassword from "./Auth/ForgotPassword";
import {useSelector} from "react-redux";
import {useLocation} from "react-router-dom";
import ExtraPages from "./ExtraPages";
import TourGuide from "./TourGuide";
import CustomTimelines from "./views/CustomTimelines";
import MaterialTimelines from "./views/MaterialTimelines";
import Calendar from "./modules/Calendar";
import UsersModule from "./modules/Users";
// import LayoutBuilder from './LayoutBuilder';

const RestrictedRoute = ({component: Component, ...rest}) => {
  const {authUser} = useSelector(({auth}) => auth);
  return (
    <Route
      {...rest}
      render={props =>
        authUser ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: "/signin",
              state: {from: props.location}
            }}
          />
        )}
    />
  );
};

const Routes = () => {
  const {authUser} = useSelector(({auth}) => auth);
  const location = useLocation();

  if (location.pathname === "" || location.pathname === "/") {
    return <Redirect to={"/dashboard"} />;
  } else if (authUser && location.pathname === "/signin") {
    return <Redirect to={"/dashboard"} />;
  }

  return (
    <React.Fragment>
      <Switch>
        <RestrictedRoute path="/dashboard" component={Dashboards} />
        <RestrictedRoute path="/widgets" component={Widgets} />
        <RestrictedRoute path="/metrics" component={Metrics} />
        <RestrictedRoute path="/components" component={Components} />
        <RestrictedRoute path="/extensions" component={Extensions} />
        <RestrictedRoute path="/visualization/chart" component={Charts} />
        <RestrictedRoute path="/visualization/map" component={Maps} />
        <RestrictedRoute path="/extra-pages" component={ExtraPages} />
        <RestrictedRoute path="/apps" component={Apps} />
        <RestrictedRoute path="/custom-timeline" component={CustomTimelines} />
        <RestrictedRoute
          path="/material-timeline"
          component={MaterialTimelines}
        />
        <RestrictedRoute path="/calendar" component={Calendar} />
        <RestrictedRoute path="/users" component={UsersModule} />
        <Route path="/signin" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/forgot-password" component={ForgotPassword} />
        {/*<Route path="/layout-builder" component={LayoutBuilder} />*/}
      </Switch>

      {location.pathname !== "/signin" &&
      location.pathname !== "/signup" &&
      location.pathname !== "/forgot-password" && <TourGuide />}
    </React.Fragment>
  );
};

export default Routes;
