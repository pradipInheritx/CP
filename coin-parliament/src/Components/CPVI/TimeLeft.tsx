import React, { useState } from "react";
import { calcTimeLeft } from "../../common/utils/time";

const TimeLeft = ({ expirationTime }: { expirationTime: number }) => {
  const [timeLeft, setTimeLeft] = useState<string | undefined>(
    calcTimeLeft(expirationTime)
  );
  const x = setInterval(function () {
    const left = calcTimeLeft(expirationTime);
    if (!left) {
      clearInterval(x);
    }
    setTimeLeft(left);
  }, 1000);
  return (
    <>
      {timeLeft && <div>{timeLeft}</div>}
      {!timeLeft && <div>loading...</div>}
    </>
  );
};

export default TimeLeft;
