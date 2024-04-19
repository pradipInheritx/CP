import { texts } from "Components/LoginComponent/texts";
import React, { useLayoutEffect } from "react";

const NftLodding = () => {
  useLayoutEffect(() => {
    const element = document.getElementById("app");

    if (element) {
      // Set pointer-events to none
      element.style.pointerEvents = "none";
    }

    return () => {
      if (element) {
        // Reset pointer-events when the component is unmounted
        element.style.pointerEvents = "auto";
      }
    };
  }, []);

  return (
    <React.Fragment>
      <div style={{
        position: 'fixed',
        height: '68%',
        // border: "2px solid red",
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        // top: '0px',
        right: '0px',
        bottom: '0px',
        zIndex: '9999',
        overflow: 'hidden',
        width: '100%',
        alignItems: 'center',

      }}>
        <span className="loading" style={{
          color: "White", zIndex: "2220px", fontSize: '1.5em',
          // marginTop: "50px"
        }}>
          {texts.waitForIt}
        </span>
      </div>
    </React.Fragment>
  );
};

export default NftLodding;