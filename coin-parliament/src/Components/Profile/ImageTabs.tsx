/** @format */

import React, { useEffect, useState } from "react";
import { Nav, Row, Tab } from "react-bootstrap";
import styled from "styled-components";
import Button from "../Atoms/Button/Button";
import { SelectCallback } from "@restart/ui/types";
import { random } from "lodash";
import { ProfileTabs } from "../../Pages/Profile";
import { isV1 } from "../App/App";

type ImageTab = {
  component: React.ReactNode;
  eventKey: string;
  label?: string;
  icon: React.ReactNode;
};

type ImageTabsProps = {
  tabs: ImageTab[];
  chosenByDefault?: string | undefined;
  handleSelect: SelectCallback;
};

const Circle = styled(Button)`
  // background: var(--color-ffffff) 0 0% no-repeat padding-box;
  // box-shadow: 0 2px 3px #6352e83b;
  // border-radius: 45px;
  opacity: 1;
  width: 30px;
  height: 30px;
  padding: 0;
`;
const Menubox = styled.div`
display:flex;
padding-top:5px;
justify-content:space-around;
align-items: center;
flex-direction: column;
  width: 80px;
  height: 60px;
  margin:0px 5px;
  // border:1px solid red;
  background: linear-gradient(180deg, #543CD6 0%, #361F86 48.96%, #160133 100%);
  // border: 2px solid;



`;

// const Label = styled.div`
//   font: var(--font-style-normal) normal var(--font-weight-normal) 9px/18px
//     var(--font-family-poppins);
//   letter-spacing: var(--character-spacing-0);
//   color: var(--color-6352e8);
//   text-align: center;
//   font-size:${window.screen.width > 767 ? "11px" : "9px"};
//   opacity: 1;

//   &:first-letter {
//     text-transform: capitalize;
//   }
// `;

const Label = styled.div`
text-shadow: 0px 1px 3px #5B03FF;
font-family: Poppins;
font-size: 8px;
font-style: normal;
font-weight: 600;
line-height: normal;
letter-spacing: 0.36px;
text-transform: capitalize;
color:white;
// background: linear-gradient(180deg, #FFFFFF 60.94%, #6a42ff 100%);
// background-clip: text;
// -webkit-background-clip: text;
// -webkit-text-fill-color: transparent;
`;


type Props = { iconName?: any };
const NavLink = styled(Nav.Link)`
  &.active {
    & button {
      background: var(--color-6352e8);
    }
  }

  &.active[id|="image-tabs"] {
    background-color: inherit;

    * {
    fill: ${(props: Props) =>
    `${props.iconName !== ""
      ? 'white'
      : ''
    }`};
      
    }
  }
`;


const ImageTabs = ({ tabs, chosenByDefault, handleSelect }: ImageTabsProps) => {

  const [activeValue, setActiveValue] = useState("");

  useEffect(() => {
    activeTab(tabs, chosenByDefault);
  }, [chosenByDefault]);


  const activeTab = (tabs: any, chosenByDefault: any) => {
    tabs.map((tab: any, index: number) => {
      if (chosenByDefault?.includes(tab.eventKey)) {
        // console.log(tabs[index].eventKey, "eventKey");
        setActiveValue(tabs[index].eventKey);
      }
    });
  };

  return (
    <Tab.Container
      id={`image-tabs-${random(100)}`}
      // activeKey={
      //   // tabs.find((tab) => tab.eventKey === chosenByDefault)?.eventKey ||
      //   // tabs[0].eventKey
      //   // activeTab(tabs,chosenByDefault)
      // }
      activeKey={activeValue}
    >
      <div className='d-flex '>
        <Nav
          variant='pills'
          className='flex-row m-auto align-items-center justify-content-center'
          onSelect={handleSelect}
        >
          {tabs.map((tab, i) => {
            return (
              <Nav.Item key={i}>
                <NavLink
                  eventKey={tab.eventKey}
                  style={{ padding: "10px 2px" }}
                  iconName={tab.label}
                  className="d-flex flex-column align-items-center"
                >
                  <Menubox>                  
                      {/* <Circle
                        className="border"
                        disabled={isV1() && tab.eventKey === ProfileTabs.mine}
                      > */}
                        {tab.icon}
                      {/* </Circle> */}
                        {tab.label && <Label>{tab.label.toUpperCase()}</Label>}
                    </Menubox>
                </NavLink>
              </Nav.Item>
            );
          })}
        </Nav>
      </div>
      <Row>
        <Tab.Content>
          {tabs.map((tab, i) => {
            return (
              <Tab.Pane key={i} eventKey={tab.eventKey}>
                {tab.component}
              </Tab.Pane>
            );
          })}
        </Tab.Content>
      </Row>
    </Tab.Container>
  );
};

export default ImageTabs;
