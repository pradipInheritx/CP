import React from "react";
import { Button } from "react-bootstrap";

const Paid = ({ handleClose }: { handleClose: () => void }) => {
  const action = () => {
    handleClose();
  };
  return (
    <div>
      <p>Modal Content</p>
      <Button onClick={action}>Click to to some action and then close</Button>
    </div>
  );
};

export default Paid;
