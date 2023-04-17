import React from "react";
import {Link} from "react-router-dom";
import { texts } from "../Components/LoginComponent/texts";
import GeneralPage from "../GeneralPage";
import rhino from '../assets/images/rhino.png'
import shark from '../assets/images/shark.png'
import gorilla from '../assets/images/gorilla.png'
import eagle from '../assets/images/eagle.png'
import tiger from '../assets/images/tiger.png'

const About = () => {
  return (
    <GeneralPage>
      <div >
        {/* <h1>{(`${texts.AboutCoinParliament}`).toUpperCase()}</h1> */}
        <div>
          
        <h6 className="text-center my-3">Hey there and welcome to Coin Parliament!</h6>

        <p>We're the most exciting web 3-based vote to earn game out there, and we're thrilled to offer you a unique opportunity to make your voice heard while earning rewards at the same time.</p>
        <p>When you join the Parliament, you'll gain access to our revolutionary social voting indicator, the SVI. This powerful tool aggregates voting profiles based on various factors, including volume, time frame, and success rate. It's the first of its kind in the world, and it's designed to help you make better investment decisions and stay ahead of the curve in the ever-changing world of cryptocurrency.</p>
        <p>But that's not all - you can also mint and get rewards by voting and receiving unique collectible cards that can be converted into NFTs. Plus, you can earn from your friends' voting activity and follow top Parliament influencers with high voting impact records to stay informed and up-to-date on all the latest trends and developments.</p>
        <p>At Coin Parliament, we're all about creating an immersive gaming experience that's both fun and rewarding. Our platform is designed to be user-friendly and accessible to everyone. </p>
        <p>So what are you waiting for? Join the Parliament today and start earning rewards while making your voice heard!</p>      
        </div>
        
        <h5 className="my-4">The Team </h5>
        
        {/* Card Rhino */}

        <div>
          <div className="text-center">
            <img src={rhino} alt="" width={window.screen.width>767? "250px":"170px" }/>
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
            <img src={eagle} alt="" width={window.screen.width>767? "300px":"250px" }/>
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
            <img src={tiger} alt="" width={window.screen.width>767? "220px":"150px" }/>
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
            <img src={gorilla} alt="" width={window.screen.width>767? "250px":"200px" }/>
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
            <img src={shark} alt="" width={window.screen.width>767? "300px":"250px" }/>
          </div>          
          <h6 className="mb-4">The Trader </h6>
          <p>A fast paced, young & confident trader with supernatural abilities to make money under any market conditions.  A self made millionaire. Created a name for himself as one of the youngest most influential traders. Not a crowd follower, but a champion at spotting individual market movements that occur on a daily or even hourly time frame. makes fast decisions. Lives by the motto High Risk High reward. </p>
          <p> <strong>Known for  </strong>The Gamer</p>
          <p> <strong>Occupation  </strong>DJ & Trader </p>
          <p> <strong>Hobbies  </strong> Poker, Making money, Music, adrenaline</p>
        </div>


        </div>
    </GeneralPage>
  );
};

export default About;
