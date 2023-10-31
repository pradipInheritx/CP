import React, { useMemo } from "react";
import { Quote } from "../common/consts/contents";
import styled from "styled-components";
import MyCarousel from "./Carousel/Carousel";
import { useWindowSize } from "../hooks/useWindowSize";
import { getMaxWidth } from "./Coins/Coins";
import { importFile } from "../assets/avatars/Avatars";
import { Image } from "react-bootstrap";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Blockquote = styled.blockquote`
  width: ${window.screen.width > 767 ?"420px" :"220px"};
  margin: 0 auto;
  position: relative;
`;

const CarouselContainer = styled.div`
  width: 100%;
  height: 128px;
  position: relative;
`;

const ItemContainer = styled(Container)`
  // width: 294px;
  height: 128px;
  padding: 16px 20px;
  // background: white 0 0 no-repeat padding-box;
  border-radius: 6px;
  font-size: 14px;
  line-height: 16px;
  // color: #6352E8;
  color:white;
  text-align: center;
  font-weight: 300;
  margin: 0 auto;
  // margin-left:10px;
  // margin-right:10px;
`;

const Text = styled.p`
// font-family: 'Kaushan Script', cursive;
font-size:17px;
`;

const Source = styled.p`
  &::before {
    content: "-";
    margin-right: 2px;
  }
`;
const Avatar = styled(Image)`
  border: 3px solid var(--blue-violet);
`;
const Item = ({ quote }: { quote: Quote }) => {
  // const {width} = useWindowSize();
  return (
    <ItemContainer className="h-100 d-flex justify-content-center align-items-center" style={{ width: `${window.screen.width > 767 ?"530px":"330px"}` }}>
      {/* <Avatar
            roundedCircle={true}
            src={importFile("./mystery", "png").default}
            alt="avatar"
            className="avatar_sm"
          /> */}
      <Blockquote>
        <Text className="mb-2">"{quote.text}"</Text>
        <Source>{quote.source}{' '}-</Source>
      </Blockquote>
    </ItemContainer>
  );
};

const Quotes = ({ quotes }: { quotes?: Quote[] }) => {
  const { width } = useWindowSize();
  const maxWidth = useMemo(() => getMaxWidth(window.screen.width), [window.screen.width]);
  return (
    <React.Fragment>
      <CarouselContainer className="table-responsive m-auto overflow-hidden" style={{ maxWidth }}>
        {quotes && <MyCarousel centerMode={false} items={1} quotes={true} transitionDuration={10000}>
          {quotes?.map((quote, i) =>
            <Item quote={quote} key={i} />)}
        </MyCarousel>}</CarouselContainer>
    </React.Fragment>
  )
};

export default Quotes;
