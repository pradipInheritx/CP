import React, { useEffect, useState } from 'react'
import { Modal, Ratio } from 'react-bootstrap'
import NftOneCard from './NftOneCard';



export type PopupItems = {
    Videoshow: any;
    setVideoshow: any;
    videoUrl?: any;
    imgUrl?: any;
    fulldata: any;
    MintedTime?: any;
    PrivateSerialNo?: any;
};
function VideoPopup({fulldata,Videoshow,setVideoshow,videoUrl,imgUrl,MintedTime,PrivateSerialNo}:PopupItems) {
    const [smShow, setSmShow] = useState(false);
    const [backCards, setBackCards] = useState<any>([]);
    
    useEffect(() => {
        if (Videoshow) {            
            setSmShow(true)
        }        
    }, [Videoshow])
    
console.log(videoUrl,imgUrl,"allmidea")
    console.log(fulldata, "offornot")
    
     const BackSideCard = (value: string | number) => {
    // @ts-ignore
    if (backCards.includes(value)) {
      let allBackCard = [...backCards];
      allBackCard.splice(backCards.indexOf(value), 1);
      setBackCards(allBackCard)
    }
    else {
      setBackCards([...backCards, value])
    };
     };       

  return (
      <div>
        <Modal        
        show={smShow}
        onHide={() => setSmShow(false)}
        //   aria-labelledby="example-modal-sizes-title-sm"
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        style={{ backgroundColor: "rgb(0 0 0 / 95%)", zIndex: "2200" }}
          // @ts-ignore
        contentClassName={"modulebackground ForBigNft"}
          >
              <div className="d-flex justify-content-end">
            <button type="button" className="btn-close btn-close-white" aria-label="Close" onClick={() => {
                      setVideoshow(false)
                      setSmShow(false)
            }}
            // style={{color:"white" , border:"1px solid red"}}
            >

            </button>
          </div>
        {/* <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-sm">
            Small Modal
          </Modal.Title>
        </Modal.Header> */}
              <Modal.Body>
                  <div
                  className='d-flex justify-content-center'
                  >                                        
                 <NftOneCard
                    DivClass={fulldata?.cardType}
                    HeaderText={fulldata?.cardType}
                    HeaderClass={`${fulldata?.cardType}_text`}
                    Serie={fulldata?.setName}
                    BackCardName={fulldata?.cardName}
                    Rarity={fulldata?.cardType}
                    CollectionType={fulldata?.albumName}
                    Quantity={fulldata?.totalQuantity}
                    holderNo={fulldata?.noOfCardHolders}
                    cardNo={`${((fulldata?.cardName)?.toUpperCase())?.slice(0, 2) + ((fulldata?.cardId || fulldata?.id).toUpperCase())?.slice(0, 2)}`}              
                    PrivateSerialNo={PrivateSerialNo}
                    // GeneralSerialNo={`${((type)?.toUpperCase())?.slice(0, 3) + ((fulldata?.cardName)?.toUpperCase())?.slice(0, 3) + fulldata?.cardId}`}
                    // GeneralSerialNo={fulldata?.sno}              
                    GeneralSerialNo={fulldata?.sno && (fulldata?.sno[0])?.replace(/[0-9]/g, '')}
                    // Disable={"CardDisebal"}
                    // When you pass CardDisebal this name then card is Disable
                    cardHeader={`${fulldata?.cardName}`}
                    // cardNo={`${fulldata.cardNo}`}
                    id={fulldata?.cardId}
                    BackSideCard={BackSideCard}
                    // flipCard={backCards == fulldata.id ? true : false}
                    flipCard={backCards?.includes(fulldata?.cardId)}
                    ImgUrl={fulldata?.cardImageUrl || ""}
                    VideoUrl={fulldata?.cardVideoUrl || ""}
                    darkTheme={true}
                    fulldata={fulldata}
                    Hide360Icon={true}                        
                      userId={fulldata?.setId}  
                  MintedTime={MintedTime}  
                    BigCard={true}
                      />   
                  </div>    
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default VideoPopup