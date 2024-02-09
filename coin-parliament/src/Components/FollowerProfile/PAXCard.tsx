import React, { useState } from "react";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "../LoginComponent/texts";
import coinBg from '../../assets/images/coin_bg.png'
import coin_bgVET from "../../assets/images/coin_bgVET.png";
import { Modal, Ratio } from "react-bootstrap";
// @ts-ignore
import Wildwest from '../../assets/avatars/videos/Winter.mp4';

type PAXCardProps = {
  walletId: string;
  PAX: number;
};

const PAXCard = ({ walletId, PAX }: PAXCardProps) => {

  const [videoShow, setVideoShow] = useState(false)
  const translate = useTranslation();
  return (
    <div className="cp_balance dark_prpl_bkgnd mx-auto mb-3"
      style={{
      height: "160px",
    }}
    >
      <h6 className="box_title card-header " style={{
        fontSize: '12px', paddingTop: '15px',
        // paddingBottom: '10px'
      }}>
        {/* {translate("Coin Parliament Balance")} */}
        {texts.CoinParliamentBalance}
      </h6>
      {/* <div className="d-flex justify-content-center align-items-center flex-column">
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
              <span className="cp_Value vstack coinText" style={{ paddingBottom: '2px', fontSize: '20px' }}>{PAX}</span>
              
            </div>
          </div>
        </div>        
      </div> */}

      <div
        style={{
          cursor:"pointer"
        }}
        //   onClick={() => {
        //     setVideoShow(true)
        // }}
        >
          <img src={coin_bgVET} alt="" width="90px" />
        </div>          
      <span className="coinText"
        style={{
        fontSize:"15px"
      }}
      >
              {PAX} VTE
            </span>                    

      
      <div>
        <Modal        
        show={videoShow}
            onHide={() => (
          setVideoShow(false)
        )}
        //   aria-labelledby="example-modal-sizes-title-sm"
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ backgroundColor: "rgb(0 0 0 / 80%)", zIndex: "2200" }}
          // @ts-ignore
        contentClassName={"modulebackground ForBigNft"}
          >
              <div className="d-flex justify-content-end">
              <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => {
                setVideoShow(false)
            }}          
            >

            </button>
          </div>        
        <Modal.Body>
              <div>
                {/* <Ratio              
                  // style={{
                  //   width:`300px`,          
                  // }}
                >
                  <embed type="" src={Wildwest} />
                </Ratio> */}
              
              <p className="text-center"
                style={{
                color:"white"
              }}
              >Coin Video Here</p>
                </div>
        </Modal.Body>
      </Modal>
    </div>
    </div>
  );
};

export default PAXCard;
