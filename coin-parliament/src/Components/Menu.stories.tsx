import React, { useState } from "react";
import { ComponentMeta, ComponentStory } from "@storybook/react";

import { default as CPMenu } from "./Menu";
import { Button, Navbar } from "react-bootstrap";
import AppContext, { AppContextProps } from "../Contexts/AppContext";
import Logo, { Size } from "./Atoms/Logo";
import { Title } from "./Header";
import { AppContainer } from "./App/App";

export default {
  title: "Components/Menu",
  component: CPMenu,
} as ComponentMeta<typeof CPMenu>;

const Template: ComponentStory<typeof CPMenu> = ({ title, ...args }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={{ height: "100vh" }}>
      <AppContext.Provider
        value={
          {
            menuOpen,
            setMenuOpen,
          } as AppContextProps
        }
      >
        <AppContainer fluid>
          <CPMenu {...args}>
            <Title>{title}</Title>
            <Navbar.Brand as={Button} variant="link">
              <Logo size={Size.XSMALL} />
            </Navbar.Brand>
          </CPMenu>
        </AppContainer>
      </AppContext.Provider>
    </div>
  );
};

export const Menu = Template.bind({});

Menu.args = {
  title: "Sample Page",
  items: [
    {
      href: "/",
      label: "Home",
    },
    {
      href: "/coins",
      label: "Coin Vote",
    },
    {
      label: "",
    },
    {
      href: "/pairs",
      label: "Pairs Vote",
    },
    {
      label: "-",
    },
    {
      href: "/influencers",
      label: "Top Influencers",
    },
  ].map((i) => (i ? i : undefined)),
};
