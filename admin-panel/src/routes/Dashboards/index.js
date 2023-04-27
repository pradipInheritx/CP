import React, {lazy, Suspense} from "react";
import {Redirect, Route, Switch} from "react-router";
import PageLoader from "../../@jumbo/components/PageComponents/PageLoader";

const Dashboards = ({match}) => {
  const requestedUrl = match.url.replace(/\/$/, "");
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Redirect
          exact
          from={`${requestedUrl}/`}
          to={`${requestedUrl}/subAdmin`}
        />        
        <Route
          path={`${requestedUrl}/crypto`}
          component={lazy(() => import("./Crypto"))}
        />
        <Route
          path={`${requestedUrl}/subadmin`}
          component={lazy(() => import("./SubAdmin"))}
        />
        <Route
          path={`${requestedUrl}/coins`}
          component={lazy(() => import("./Coins"))}
        />
        <Route
          path={`${requestedUrl}/pairs`}
          component={lazy(() => import("./Pairs"))}
        />
        <Route
          path={`${requestedUrl}/users`}
          component={lazy(() => import("./Users"))}
        />
        <Route
          path={`${requestedUrl}/usertypesetting`}
          component={lazy(() => import("./UserTypeSetting"))}
        />
        <Route
          path={`${requestedUrl}/timeframesetting`}
          component={lazy(() => import("./TimeFrame"))}
        />
        <Route
          path={`${requestedUrl}/voteperuser`}
          component={lazy(() => import("./VotePerUser"))}
        />
        <Route
          path={`${requestedUrl}/votebooster`}
          component={lazy(() => import("./VoteBoost"))}
        />
        <Route
          path={`${requestedUrl}/followtable`}
          component={lazy(() => import("./FollowTable"))}
        />
        <Route
          path={`${requestedUrl}/coinsvotestable`}
          component={lazy(() => import("./CoinVoteTable"))}
        />
        <Route
          path={`${requestedUrl}/pairsvotestable`}
          component={lazy(() => import("./PairVoteTable"))}
        />
        <Route
          path={`${requestedUrl}/votingpass`}
          component={lazy(() => import("./VotePass"))}
        />
        <Route
          path={`${requestedUrl}/cmptransactions`}
          component={lazy(() => import("./CMPTr"))}
        />
        <Route
          path={`${requestedUrl}/transactiontypes`}
          component={lazy(() => import("./TrTypes"))}
        />
        <Route
          path={`${requestedUrl}/rewardtransactions`}
          component={lazy(() => import("./RewardTr"))}
        />
        <Route
          path={`${requestedUrl}/paymenttransactions`}
          component={lazy(() => import("./PaymentTr"))}
        />
        <Route
          path={`${requestedUrl}/listing`}
          component={lazy(() => import("./Listing"))}
        />
        <Route
          path={`${requestedUrl}/crm`}
          component={lazy(() => import("./Crm"))}
        />
        <Route
          path={`${requestedUrl}/intranet`}
          component={lazy(() => import("./Intranet"))}
        />
        <Route
          path={`${requestedUrl}/eCommerce`}
          component={lazy(() => import("./ECommerce"))}
        />
        <Route
          path={`${requestedUrl}/news`}
          component={lazy(() => import("./News"))}
        />
        <Route
          path={`${requestedUrl}/misc`}
          component={lazy(() => import("./Misc"))}
        />
        <Route component={lazy(() => import("../ExtraPages/404"))} />
      </Switch>
    </Suspense>
  );
};

export default Dashboards;
