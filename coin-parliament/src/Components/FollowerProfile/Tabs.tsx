import React from "react";
import { Form, Nav, Tab } from "react-bootstrap";
import styled from "styled-components";

type TabsProps = {
  defaultActiveKey: string;
  id: string;
  onSelect: () => void;
  tabs: { eventKey: string; title: string; pane: React.ReactNode }[];
  setRunVote?: any;
  runVote?: any;
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
        border-bottom:${window.screen.width < 767 ? "3px solid #fff" : "3px solid #5d49e0"};
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

const Tabs = ({ defaultActiveKey, id, onSelect, tabs, setRunVote, runVote }: TabsProps) => {
  return (
    <Tab.Container
      {...{
        defaultActiveKey,
        id,
        onSelect,
      }}

    >
      <Container className="d-flex justify-content-center align-items-center" style={{ background: window.screen.width < 979 ? '#6352e8' : '', color: window.screen.width < 979 ? '' : '#6352e8' }}>
        <Nav variant="tabs" className="">
          {tabs.map((t, i) => {
            return (
              <Nav.Item key={i}>
                <Nav.Link eventKey={t.eventKey} style={{ background: window.screen.width < 979 ? '#6352e8' : '', color: window.screen.width < 979 ? '' : '#6352e8' }}>{t.title.toUpperCase()}</Nav.Link>
              </Nav.Item>
            );
          })}
        </Nav>
        {/* <input type="check" onChange={() => { setRunVote(!runVote) }} /> */}
      </Container>
      <div
        className="d-flex justify-content-center align-items-center mt-2 d-none"
      >
        <div className="d-flex justify-content-start align-items-center">
          <Form.Check
            className="boxCheck"
            style={{ fontSize: "20px", marginRight: "10px", outline: 0 }}
            type="checkbox"
            id={`default-checkbox`}
            // label={`default checkbox`}
            // onClick={availableCard}
            onClick={() => { setRunVote(!runVote) }}
          />
          <label htmlFor="default-checkbox" className="custom-control-label" style={{ color: "#6352e8" }}>Open vote</label>
        </div>
      </div>
      <div className="pb-1">
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
