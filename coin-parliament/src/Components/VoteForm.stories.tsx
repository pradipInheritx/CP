import React, { useEffect, useState } from "react";
import { colors, default as CPVoteForm } from "./VoteForm";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { Coin } from "../common/models/Coin";
import { useTranslation } from "../common/models/Dictionary";
import { coins, timeframes } from "./Coins/testData";
import { action } from "@storybook/addon-actions";
import AppContext, { AppContextProps } from "../Contexts/AppContext";
import Bear from "./icons/Bear";
import Bull from "./icons/Bull";
import { Form } from "react-bootstrap";
import { texts } from "./LoginComponent/texts";

export default {
  title: "Components/Coins",
  component: CPVoteForm,
} as ComponentMeta<typeof CPVoteForm>;

const coin = coins["BTC"] || ({} as Coin);
const options = ["Bear", "Bull"];
const Template: ComponentStory<typeof CPVoteForm> = () => {
  const translate = useTranslation();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<number>();
  const [selectedOption, setSelectedOption] = useState<number>();
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (selectedTimeFrame !== undefined && selectedOption !== undefined) {
      action("vote")(
        options[selectedOption],
        timeframes[selectedTimeFrame].name
      );
    }
  }, [selectedTimeFrame, selectedOption]);

  return (
    <AppContext.Provider value={{ timeframes } as AppContextProps}>
      <Form>
        <Form.Check
          type="switch"
          id="disable"
          label="disable"
          checked={disabled}
          onChange={() => setDisabled(!disabled)}
        />
      </Form>
      {/* <CPVoteForm
        {...{
          selectedTimeFrame,
          setSelectedTimeFrame,
          selectedOption,
          setSelectedOption,
          disabled,
          submit: action("submit"),
        }}
        id="BullVsBearForm"
        option1={{
          image: <Bear color={selectedOption === 0 ? colors[1] : colors[0]} />,
          alt:`${texts.Bear}`,
          ...coin,
        }}
        option2={{
          image: <Bull color={selectedOption === 1 ? colors[1] : colors[0]} />,
          alt:`${texts.Bull}`,
          ...coin,
        }}
        canVote={true}
        texts={{
          // yourVote: translate("Place your vote"),
          // yourVote: translate("Vote for your winner"),
          yourVote:`${texts.VoteForYourWinner}`,
          // selectTimeFrame: translate("select time frame"),
          selectTimeFrame:`${texts.SelectTimeFrame}`,
          // tooltip: translate("you must be logged in to vote"),
          tooltip:`${texts.YouMustLoggedInVote}`,
        }}
      /> */}
    </AppContext.Provider>
  );
};

export const VoteForm = Template.bind({});

VoteForm.args = {};
