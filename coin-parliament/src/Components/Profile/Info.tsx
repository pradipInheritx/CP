import React from "react";
import styled from "styled-components";
import { useTranslation } from "../../common/models/Dictionary";
import { texts } from "../LoginComponent/texts";

const Box = styled.div`
  width: 322px;
  height: 40px;
  border-radius: 6px;
  background-color: #160133;
  font-size: 19px;
  line-height: 40px;
`;

const PurpleText = styled.div`
  color: var(--blue-violet);
`;

type InfoProps = {
  friends: number;
  cpm: number;
};
const Info = ({ friends, cpm }: InfoProps) => {
  const translate = useTranslation();
  return (
    <Box className="mx-auto d-flex justify-content-around text-white" style={{width:window.screen.width<979?'322px':'40%'}}>
      <div>
        <PurpleText className="d-inline-block fw-bold me-1">
          {friends}
        </PurpleText>
        <div className="d-inline-block text-uppercase" style={{fontWeight:'400'}}>
          {/* {translate("friends")} */}
          {texts.friends}
        </div>
      </div>
      <div>
        <PurpleText className="d-inline-block fw-bold me-1">{cpm}</PurpleText>
        <div className="d-inline-block text-uppercase" style={{fontWeight:'400'}}>CMP</div>
      </div>
    </Box>
  );
};

export default Info;
