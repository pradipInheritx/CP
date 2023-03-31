import React from "react";
import {Link} from "react-router-dom";
import { texts } from "../Components/LoginComponent/texts";
import GeneralPage from "../GeneralPage";

const
  GameRule = () => {
  return (
    <GeneralPage>
      <div >
      <h1> {(`${texts.GAMERULECOINPARLIAMENT}`).toUpperCase()}</h1>
      <p>Coin Parliament Coin Parliament aims to provide a community environment where all of our users can share their
        opinions and vote freely and learn from each other. Everyone is welcome to come to our platform and provide
        insightful, delightful and informative thoughts, but we also hope to provide a space where everyone respects
        each other <Link to={"/"}>I am a link in a P</Link>, abuse or promotional messages. We want all users to feel
        comfortable and safe
        being in the space. Therefore, we are setting up some community rules to define what is acceptable and what is
        not — all users are expected to follow our community guidelines!</p>
      <p>Whoever fails to follow our rules will have their messages deleted, and further action taken if necessary. Coin
        Parliament could temporarily or permanently suspend accounts from being able to post, comment, repost or share
          any messages from the Coin Parliament discussion feature if community rules are repeatedly violated.</p>
        </div>
    </GeneralPage>
  );
};

export default GameRule;
