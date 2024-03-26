import React, { useEffect, useState } from "react";
import { Form, Nav, Tab } from "react-bootstrap";
import styled from "styled-components";
import { texts } from "../LoginComponent/texts";

type TabsProps = {
  defaultActiveKey: string;
  id: string;
  onSelect: any;
  tabs: { eventKey: string; title: string; pane: React.ReactNode }[];
  setRunVote?: any;
  runVote?: any;
  getVotes?: any;
  isLoading?: boolean;
  activeKey?: string;
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

const Tabs = ({ isLoading, defaultActiveKey, id, onSelect, tabs, setRunVote, runVote, getVotes, activeKey }: TabsProps) => {



  return (
    <>
      <Tab.Container
        {...{
          defaultActiveKey,
          id,
          onSelect,
          activeKey,
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
        </Container>
        {tabs[0]?.title == "Pair" && <div
          className="d-flex justify-content-center align-items-center mt-2"
        >
          <div className="d-flex justify-content-start align-items-center">
            <Form.Check
              className="boxCheck"
              style={{ fontSize: "20px", marginRight: "10px", outline: 0 }}
              type="checkbox"
              id={`default-checkbox`}
              onClick={() => { setRunVote(!runVote); getVotes(0, !runVote); }}
            />
            <label htmlFor="default-checkbox" className="custom-control-label" style={{ color: "#6352e8" }}>Open vote</label>
          </div>
        </div>}
        {isLoading && <div style={{
                position: 'fixed',
                height: '68%',          
                display: 'flex',
                textAlign: 'center',
                justifyContent: 'center',
                // top: '0px',
                right: '0px',
                bottom: '0px',
                zIndex: '9999',
                overflow: 'hidden',
                width: '100%',
                alignItems: 'center',

            }}>
          <span className="loading" style={{
            color: "#7767f7", zIndex: "2220px", fontSize: '1.5em',
            // marginTop: `${window.screen.width > 767 ? "100px" : "240px"}`
          }}>
                    {texts.waitForIt}
                </span>
            </div>}
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
    </>
  );
};

export default Tabs;
