import React, { useContext } from "react";
// import {Link} from "react-router-dom";
// import { texts } from "../Components/LoginComponent/texts";
import GeneralPage from "../GeneralPage";
import rhino from '../assets/images/rhino.png'
import shark from '../assets/images/shark.png'
import gorilla from '../assets/images/gorilla.png'
import eagle from '../assets/images/eagle.png'
import tiger from '../assets/images/tiger.png'
import rhinow from '../assets/images/rhino.webp'
import sharkw from '../assets/images/shark.webp'
import gorillaw from '../assets/images/gorilla.webp'
import eaglew from '../assets/images/eagle.webp'
import tigerw from '../assets/images/tiger.webp'
import UserContext from "../Contexts/User";
import AppContext from "../Contexts/AppContext";
import { Buttons } from "../Components/Atoms/Button/Button";
import { texts } from "../Components/LoginComponent/texts";

const About = () => {
  const { user } = useContext(UserContext);
  const { setLogin, setSignup } = useContext(AppContext);
  return (
    <GeneralPage>
      <div >
        {/* <h1>{(`${texts.AboutCoinParliament}`).toUpperCase()}</h1> */}
        <div>
          <h1 style={{ textAlign: 'center' }}>  Hey there and welcome to Coin Parliament!</h1>
          <p style={{ textAlign: 'justify' }} >We're the most exciting web 3-based Vote To Earn game out there, and we're thrilled to offer you a unique opportunity to make your voice heard while earning rewards at the same time.</p>
          <p style={{ textAlign: 'justify' }}>
            At Coin Parliament, we're not just a game; we're a community of crypto enthusiasts and collectors. Our platform combines the excitement of crypto with the thrill of card collecting and the potential for substantial rewards.
            We're delighted to have you join our growing community at Coin Parliament. Here, you'll discover a world of crypto-driven excitement, where your votes, card collections, and strategic upgrades unlock a universe of opportunities.
            From unique cards to Collectibles, influencer levels to lifetime royalties, your journey with us promises adventure and prosperity. We're here to support you every step of the way.
          </p>

        </div>

        <h5 className="my-4">The Team </h5>

        {/* Card Rhino */}

        <div>
          <div className="text-center">
            <picture>
              <source type="image/webp" srcSet={rhinow} width={window.screen.width > 767 ? "250px" : "170px"} />
              <source type="image/jpeg" srcSet={rhino} width={window.screen.width > 767 ? "250px" : "170px"} />
              <img src={rhino} alt="" width={window.screen.width > 767 ? "250px" : "170px"} />
            </picture>
            {/* <img src={rhino} alt="" width={window.screen.width>767? "250px":"170px" }/> */}
          </div>
          <h6 className="mb-4">The Founder </h6>
          <p>Established CP and multiple other successful startups which have collectively IPO’s for over 100 Billion. Passionate about new concepts with a radical imagination & clear vision to revolutionize. Holds a high-risk tolerance, extremely knowledgeable and is a hit with the crowds.  </p>
          <p> <strong>Known for  </strong> The GOAT  </p>
          <p> <strong>Occupation  </strong> Businessman, Investor  </p>
          <p> <strong>Hobbies  </strong> Golf, Whiskey & Wine making  </p>
        </div>


        {/* card eagle  */}

        <div>

          <div className="text-center">
            <picture>
              <source type="image/webp" srcSet={eaglew} width={window.screen.width > 767 ? "300px" : "250px"} />
              <source type="image/jpeg" srcSet={eagle} width={window.screen.width > 767 ? "300px" : "250px"} />
              <img src={eagle} alt="" width={window.screen.width > 767 ? "300px" : "250px"} />
            </picture>
            {/* <img src={eagle} alt="" width={window.screen.width>767? "300px":"250px" }/> */}
          </div>
          <h6 className="mb-4">The Investor </h6>
          <p>Chairman of one of the world's leading VC’s, Board member of 18 internet & tech companies, portfolio consists predominantly of Crypto and stocks. Is seen as the ‘high priest’ in the investment community. Fast thinker, spots changes in trends ahead of others, but patient with his approach to investing - starts early and looks for fundamental long-term growth. </p>
          <p> <strong>Known for  </strong> The Priest</p>
          <p> <strong>Occupation  </strong> Venture Capitalist</p>
          <p> <strong>Hobbies  </strong>Skiing, Swimming</p>
        </div>


        {/* card Tiger */}

        <div>

          <div className="text-center">
            <picture>
              <source type="image/webp" srcSet={tigerw} width={window.screen.width > 767 ? "220px" : "150px"} />
              <source type="image/jpeg" srcSet={tiger} width={window.screen.width > 767 ? "220px" : "150px"} />
              <img src={tiger} alt="" width={window.screen.width > 767 ? "220px" : "150px"} />
            </picture>
            {/* <img src={tiger} alt="" width={window.screen.width>767? "220px":"150px" }/> */}
          </div>
          <h6 className="mb-4">The Angel</h6>

          <p>A serial entrepreneur, startup blood runs through her veins. She has founded 3 startups in the fashion industry which put her on the list of most powerful women in the world. Ultra-high net worth individual, with a strategic network, seeking highly innovative early-stage companies to ignite her soul. A huge believer in CP and was one of the larger seed investors.</p>

          <p> <strong>Known for  </strong>Her Integrity</p>
          <p> <strong>Occupation  </strong> Entrepreneur </p>
          <p> <strong>Hobbies  </strong> Fashion, Arts & Politics  </p>
        </div>

        {/* card gorilla  */}

        <div>
          <div className="text-center">
            <picture>
              <source type="image/webp" srcSet={gorillaw} width={window.screen.width > 767 ? "250px" : "200px"} />
              <source type="image/jpeg" srcSet={gorilla} width={window.screen.width > 767 ? "250px" : "200px"} />
              <img src={gorilla} alt="" width={window.screen.width > 767 ? "250px" : "200px"} />
            </picture>
            {/* <img src={gorilla} alt="" width={window.screen.width>767? "250px":"200px" }/> */}
          </div>
          <h6 className="mb-4">The HODLER </h6>
          <p>A tech savvy enthusiast, extremely knowledgeable, a true leader by experience. A protector & keeper whilst simultaneously fueling advancement. Consistently guiding and nourishing opportunity with true determination picking up followers wherever he goes.  </p>
          <p> <strong>Known for  </strong>The Shepherd</p>
          <p> <strong>Occupation  </strong>Programmer, CTO</p>
          <p> <strong>Hobbies  </strong>Music, Iron Man, technology</p>
        </div>

        {/* card shark */}

        <div>
          <div className="text-center">
            <picture >
              <source type="image/webp" srcSet={sharkw} width={window.screen.width > 767 ? "300px" : "250px"} />
              <source type="image/jpeg" srcSet={shark} width={window.screen.width > 767 ? "300px" : "250px"} />
              <img src={shark} alt="" width={window.screen.width > 767 ? "300px" : "250px"} />
            </picture>
            {/* <img src={shark} alt="" width={window.screen.width>767? "300px":"250px" }/> */}
          </div>
          <h6 className="mb-4">The Trader </h6>
          <p>A fast paced, young & confident trader with supernatural abilities to make money under any market conditions.  A self made millionaire. Created a name for himself as one of the youngest most influential traders. Not a crowd follower, but a champion at spotting individual market movements that occur on a daily or even hourly time frame. makes fast decisions. Lives by the motto High Risk High reward. </p>
          <p> <strong>Known for  </strong>The Gamer</p>
          <p> <strong>Occupation  </strong>DJ & Trader </p>
          <p> <strong>Hobbies  </strong> Poker, Making money, Music, adrenaline</p>
        </div>

        {!user?.uid && window.screen.width > 979 && <div className='d-sx-none'> <Buttons.Primary style={{ margin: 'auto', marginTop: '4rem', fontSize: '2rem', padding: '2rem' }} onClick={e => {
          setLogin(true)
          setSignup(true)
        }}>{texts.signUp}</Buttons.Primary></div>}



        {!user?.uid && window.screen.width < 979 && <div className='d-xl-none'><Buttons.Primary style={{ margin: 'auto', marginTop: '2rem', fontSize: '1rem', padding: '1rem' }} onClick={e => {
          setLogin(true)
          setSignup(true)
        }}>{texts.signUp}</Buttons.Primary>
        </div>}

      </div>
    </GeneralPage>
  );
};

export default About;
