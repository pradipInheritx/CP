import React from "react";
import { Link } from "react-router-dom";
import { texts } from "../Components/LoginComponent/texts";
import GeneralPage from "../GeneralPage";

const
  Foundations = () => {
    return (
      <GeneralPage>
        <div >
          <div style={{ textAlign: 'center' }}>
            <h1>
              {(`${texts.Foundations}`).toUpperCase()}:
            </h1>
          </div>
          <p style={{ textAlign: 'justify' }}>
            For every PAX token that is minted on Coin Parliament, you have the opportunity to choose one of these charitable foundations:
          </p>
          <ul style={{ textAlign: 'justify' }}>
            <li>
              UNICEF: Supporting children's rights, UNICEF provides healthcare, clean water, education, and protection to children in need worldwide.
            </li>
            <li>
              Save the Children: Save the Children works to improve the lives of children through education, healthcare, and protection from harm, ensuring every child has a chance to thrive.
            </li>
            <li>
              Salvation Army: The Salvation Army offers assistance to those in need, including food, shelter, and rehabilitation services, helping individuals and families overcome hardships.
            </li>
            <li>
              United Way: United Way focuses on community development, addressing issues like poverty and education to create lasting change in local communities.
            </li>
            <li>
              American Red Cross: The American Red Cross provides disaster relief, blood donation services, and support to military families, saving lives and easing human suffering.
            </li>
          </ul>
          <p style={{ textAlign: 'justify' }}>
            You can select which charitable foundation you'd like to support, and we will donate an extra 10% (from our account) to your chosen charity. This means that each time a PAX token is minted, you can make a meaningful contribution to the cause you care about the most through your participation in Coin Parliament.
          </p>
        </div>
      </GeneralPage>
    );
  };

export default Foundations;
