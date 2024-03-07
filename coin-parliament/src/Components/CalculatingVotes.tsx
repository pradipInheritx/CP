import React, { useLayoutEffect } from "react";

const CalculatingVotes = () => {
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
      <div
        className="d-flex justify-content-center align-items-center w-100 text-center"
        style={{height: 100}}
      >
        <div className="blink m-5">Calculating Votes</div>
      </div>
    </React.Fragment>
  );
};

export default CalculatingVotes;

// import React from "react";

// const CalculatingVotes = () => {
//   return (
//     <React.Fragment>
//       <div
//         className="d-flex justify-content-center align-items-center w-100 text-center"
//         style={{height: 100}}
//       >
//         <div className="blink m-5">Calculating Votes</div>
//       </div>
//     </React.Fragment>
//   );
// };

// export default CalculatingVotes;