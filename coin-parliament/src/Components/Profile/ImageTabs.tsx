/** @format */

import React from "react";
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
  chosenByDefault?: string;
  handleSelect: SelectCallback;
};

const Circle = styled(Button)`
  background: var(--color-ffffff) 0 0% no-repeat padding-box;
  box-shadow: 0 2px 3px #6352e83b;
  border-radius: 45px;
  opacity: 1;
  width: 50px;
  height: 50px;
  padding: 0;
`;

const Label = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal) 9px/18px
    var(--font-family-poppins);
  letter-spacing: var(--character-spacing-0);
  color: var(--color-6352e8);
  text-align: center;
  font-size:${window.screen.width>767?"11px":"9px"};
  opacity: 1;

  &:first-letter {
    text-transform: capitalize;
  }
`;
type Props =  { iconName?: any };
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
      `${
        props.iconName !== "Gallery"
          ? 'white'
            : ''
      }`};
      
    }
  }
`;

const ImageTabs = ({ tabs, chosenByDefault, handleSelect }: ImageTabsProps) => {
  return (
    <Tab.Container
      id={`image-tabs-${random(100)}`}
      activeKey={
        tabs.find((tab) => tab.eventKey === chosenByDefault)?.eventKey ||
        tabs[0].eventKey
      }
    >
      <div className='d-flex'>
        <Nav
          variant='pills'
          className='flex-row m-auto align-items-center justify-content-center'
          onSelect={handleSelect}
        >
          {tabs.map((tab, i) => {
            return (
              <Nav.Item key={i}>
                <NavLink eventKey={tab.eventKey} style={{ padding: "10px 2px" ,}} iconName={tab.label}>
                  <Circle
                    disabled={isV1() && tab.eventKey === ProfileTabs.mine}
                  >
                    {tab.icon}
                  </Circle>
                  {tab.label && <Label>{tab.label}</Label>}
                </NavLink>
              </Nav.Item>
            );
          })}
        </Nav>
      </div >
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
