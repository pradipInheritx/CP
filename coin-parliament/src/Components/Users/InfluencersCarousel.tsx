import React, {useContext, useMemo, useState} from "react";
import MyCarousel from "../Carousel/Carousel";
import styled from "styled-components";
import AppContext from "../../Contexts/AppContext";
import {UserTypeProps} from "../../common/models/UserType";
import Leaderboard from "../Leaderboard";
import CoinsContext from "../../Contexts/CoinsContext";
import UserContext from "../../Contexts/User";
import {setChecked} from "../../common/models/User";
import {useWindowSize} from "../../hooks/useWindowSize";
import {upperCase} from "lodash";
import {Buttons} from "../Atoms/Button/Button";
import {useTranslation} from "../../common/models/Dictionary";
import {useNavigate} from "react-router-dom";
import { getMaxWidth } from "../Coins/Coins";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Button = styled(Buttons.ClickableText)`
  color: #6352E8;
  font-size: 11px;
  line-height: 16px;
`;

const CarouselContainer = styled.div`
  width: 100%;
  position: relative;
`;

const H2 = styled.div`
  color: #23036A;
  font-size: 13px;
  line-height: 16px;
  text-align: center;
  margin: 12px auto 19px;
`;

const ButtonContainer = styled.div`
  width: 60px;
  padding: 4px;
`;

const ItemContainer = styled(Container)`
  // width: 263px;
  background: white;
  padding: 16px 20px;
  border-radius: 6px;
  font-size: 14px;
  line-height: 16px;
  text-align: center;
  font-weight: 300;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  max-height:272px;
  min-height:272px;
  min-width:200px;
  // margin-left:10px;
  // margin-right:10px;
`;
const IndicatorContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  align-content: stretch;
  padding: 15px;
`;
const Indicators = styled.div`
  flex: 1;
  margin: 0 auto;
  height: 56px;
  max-width: 100%;
  width: ${(props: { width?: number }) => `${props.width && props.width < 979 ? "125px" : "50vw"}`};
  flex-wrap: wrap;

  & .carousel-indicators [data-bs-target] {
    width: 8px;
    height: 8px;
    border-radius: 100%;
  }
`;
const Indicator = styled.button`
  &[data-bs-target] {
    width: 8px;
    height: 8px;
    border-radius: 100%;
  }
`;
const Item = ({userType}: { userType: UserTypeProps }) => {
  const {leaders} = useContext(CoinsContext);
  const {userInfo, user} = useContext(UserContext);
  const {setChosenUserType}=useContext(AppContext)
  const translate = useTranslation();
  let navigate = useNavigate();

  return (
    <ItemContainer className=" d-flex justify-content-center align-items-center ">
      <H2>TOP {userType.name.toUpperCase()}S</H2>
      <Leaderboard
        {...{
          leaders: leaders.filter((leader) => {
            return (
              leader.status?.toLowerCase() === userType.name.toLowerCase()
            );
          })?.slice(0,3),
          userInfo,
          setChecked: setChecked(leaders, user),
        }}
      />
      <ButtonContainer>
        <Button
          onClick={() => {
            // navigate("/influencers/?view=" + userType.name.toLowerCase());
            navigate("/influencers")
            setChosenUserType(userType.name)
          }}
        >
          {upperCase(translate("view all"))}
        </Button>
      </ButtonContainer>
    </ItemContainer>
  );
};

const InfluencersCarousel = () => {
  const {userTypes} = useContext(AppContext);
  const {width} = useWindowSize();
  const maxWidth = useMemo(() => getMaxWidth(width), [width]);
  const [index,setIndex]=useState(0)
  const [active, setActive] = useState(0);
  return (
    <React.Fragment>
      <CarouselContainer className="table-responsive m-auto overflow-hidden" style={{maxWidth}}>
        {<MyCarousel centerMode={!(width && width > 969)}
        cursorShow={true}
        >
          {userTypes?.map((userType, i) =>
          <div  style={{minHeight:'272px',margin:'0.3rem'}}>
            <Item userType={userType} key={i}/>
            </div>)}
          
        </MyCarousel>}
        
        {/* <IndicatorContainer>
          <Indicators className="carousel-indicators" width={width}>
            {userTypes.map((pair, o) => (
              <Indicator
                key={o}
                type="button"
                data-bs-target={`#${'influencer'}`}
                data-bs-slide-to={o}
                className={o === index ? "active" : ""}
                aria-current={o === index ? "true" : "false"}
                aria-label={`Slide ${o}`}
                onClick={() => {
                  setIndex(o);
                  setActive(o);
                }}
                data-bs-slide="next"
              />
            ))}
          </Indicators>
        </IndicatorContainer> */}
        </CarouselContainer>
    </React.Fragment>
  );
};

export default InfluencersCarousel;
