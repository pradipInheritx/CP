import React from "react";
import { Nav, Tab } from "react-bootstrap";
import styled from "styled-components";

type TabsProps = {
  defaultActiveKey: string;
  id: string;
  onSelect: () => void;
  tabs: { eventKey: string; title: string; pane: React.ReactNode }[];
};

const Container = styled.div`
  // background: var(--color-6352e8) 0 0% no-repeat padding-box;
  & .nav-tabs {
    border: 0;
  }
  & .nav-item {
    & .nav-link {
      font: var(--font-style-normal) normal medium var(--font-size-14) / 18px
        var(--font-family-poppins);
      letter-spacing: var(--character-spacing-0);
      color: var(--white);
      text-align: center;
      opacity: 0.5;
      &.active {
        background: transparent;
        font: var(--font-style-normal) normal medium var(--font-size-14) / 18px
          var(--font-family-poppins);
        letter-spacing: var(--character-spacing-0);
        color: var(--white);
        text-align: center;
        opacity: 1;
        border: 0;
        border-bottom:${window.screen.width <767? "3px solid #fff":"3px solid #5d49e0" };
      }
    }
  }
`;

const Content = styled.div`
  padding-top: 44px;
  & .fade:not(.show) {
    display: none;
  }
`;

const Tabs = ({ defaultActiveKey, id, onSelect, tabs }: TabsProps) => {
  return (
    <Tab.Container
      {...{
        defaultActiveKey,
        id,
        onSelect,
      }}      
      
    >
      <Container className="d-flex justify-content-center align-items-center" style={{background:window.screen.width<979?'#6352e8':'',color:window.screen.width<979?'':'#6352e8'}}>
        <Nav variant="tabs" className="">
          {tabs.map((t, i) => {
            return (
              <Nav.Item key={i} >
                <Nav.Link eventKey={t.eventKey} style={{background:window.screen.width<979?'#6352e8':'',color:window.screen.width<979?'':'#6352e8'}}>{t.title.toUpperCase()}</Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
      </Container>
      <div  className="pb-1">
        <Tab.Content>
          <Content>
            {tabs.map((t, i) => {
              return (
                <Tab.Pane key={i} eventKey={t.eventKey}>
                  {t.pane}
                </Tab.Pane>
              );
            })}
          </Content>
        </Tab.Content>
      </div>
    </Tab.Container>
  );
};

export default Tabs;
