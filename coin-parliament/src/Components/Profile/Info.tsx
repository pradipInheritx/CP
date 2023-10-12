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
  font-family: Poppins;
  font-size: 1.2rem;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  letter-spacing: 0.035rem;
  background: linear-gradient(180deg, #FEFEFE 35.94%, #3C1ABA 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent; 
`;

type InfoProps = {
  friends: number;
  cpm: number;
};
const Info = ({ friends, cpm }: InfoProps) => {
  const translate = useTranslation();
  return (
    <Box className="mx-auto d-flex justify-content-around text-white" style={{ width: window.screen.width < 979 ? '322px' : '40%', backgroundColor: "rgba(84, 60, 214, 0.40)" }}>
      <div>
        <PurpleText className="d-inline-block fw-bold me-1">
          {friends}
        </PurpleText>
        <PurpleText className="d-inline-block fw-bold me-1">
          {`Friends`}
        </PurpleText>
      </div>
      <div>
        <PurpleText className="d-inline-block fw-bold me-1">
          {cpm}
        </PurpleText>
        <PurpleText className="d-inline-block fw-bold me-1">
          {`CMP`}
        </PurpleText>
      </div>
    </Box>
  );
};

export default Info;
