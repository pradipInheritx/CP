import React from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "../LoginComponent/texts";
import coinBg from '../../assets/images/coin_bg.png'

type PAXCardProps = {
  walletId: string;
  PAX: number;
};

const PAXCard = ({ walletId, PAX }: PAXCardProps) => {
  const translate = useTranslation();
  return (
    <div className="cp_balance dark_prpl_bkgnd mx-auto mb-3">
      <h6 className="box_title card-header " style={{ fontSize: '12px', paddingTop: '15px', paddingBottom: '10px' }}>
        {/* {translate("Coin Parliament Balance")} */}
        {texts.CoinParliamentBalance}
      </h6>
      <div className="d-flex justify-content-center align-items-center flex-column">
        <div className="circle"
          style={{
            backgroundImage: `url(${coinBg})`,
            // backgroundImage: `url(${externalImage})`,
            // backgroundSize: 'cover',
            backgroundSize: "90px 87px",
            // backgroundPosition: "2px 0px",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '-8px -5px',
            // height: '500px',
          }}
        >
          <div
            className="d-flex justify-content-center align-items-center flex-column"
            style={{ height: 75, color: '#6352E8' }}
          >
            <div>
              <span className="cp_Value vstack" style={{ paddingBottom: '2px', fontSize: '20px' }}>{PAX}</span>
              {/* <span className="cp_PAX" >PTS</span> */}
            </div>
          </div>
        </div>
        <p className="cp_wallet mt-3">{walletId}</p>
      </div>
    </div>
  );
};

export default PAXCard;
