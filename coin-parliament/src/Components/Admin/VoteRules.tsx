import React, { useContext } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import uniq from "lodash/uniq";
import AppContext from "../../Contexts/AppContext";
import { TimeFrame } from "../../common/models/Vote";
import TextField from "./Textfield";

const VoteRules = () => {
  const { timeframes, setTimeframes, voteRules, setVoteRules } =
    useContext(AppContext);

  const submitTimeframe = (
    index: number,
    name: string,
    value: number,
    chosen?: boolean
  ) => {
    const t = [...timeframes];
    const timeframe: TimeFrame = {
      index,
      name,
      seconds: value,
      chosen: !!chosen,
    };

    t.splice(index, 1, timeframe);

    setTimeframes(uniq(t));
  };

  const removeTimeframe = (i: number) => {
    const t = [...timeframes];
    t.splice(i, 1);
    if (!timeframes.length) {
      t.push({
        index: 0,
        name: "",
        seconds: 0,
      });
    }
    setTimeframes(t);
  };

  const addTimeframe = () => {
    const currentLength = timeframes.length;
    setTimeframes([
      ...timeframes,
      {
        index: currentLength + 1,
        name: "",
        seconds: 0,
      },
    ]);
  };

  return (
    <>
      <Form className="mt-1">
        <Container>
          <Row>
            <Col sm={6}>
              <Row>
                <TextField
                  {...{
                    label:
                      "How many times user can vote in a period of 24 hours",
                    name: "max_vote",
                    placeholder:
                      "How many times user can vote in a period of 24 hours",
                    type: "number",
                    value: voteRules.maxVotes + "",
                    onChange: (e) => {
                      const { givenCPM, CPMReturnSuccess, CPMReturnFailure } =
                        voteRules;
                      setVoteRules({
                        CPMReturnSuccess,
                        CPMReturnFailure,
                        givenCPM,
                        maxVotes: e.target.value as unknown as number,
                      });
                    },
                  }}
                />
                <TextField
                  {...{
                    label: "How many given CPM for a basic unit of vote",
                    name: "given_CPM",
                    placeholder: "How many given CPM for a basic unit of vote",
                    type: "number",
                    value: voteRules.givenCPM + "",
                    onChange: (e) => {
                      const { CPMReturnSuccess, CPMReturnFailure, maxVotes } =
                        voteRules;
                      setVoteRules({
                        CPMReturnSuccess,
                        CPMReturnFailure,
                        givenCPM: e.target.value as unknown as number,
                        maxVotes,
                      });
                    },
                  }}
                />

                <TextField
                  {...{
                    label: "How much is the return in case of success",
                    name: "CPM_return",
                    placeholder: "How much is the return in case of success",
                    type: "number",
                    value: voteRules.CPMReturnSuccess + "",
                    onChange: (e) => {
                      const { givenCPM, maxVotes, CPMReturnFailure } =
                        voteRules;
                      setVoteRules({
                        CPMReturnSuccess: e.target.value as unknown as number,
                        CPMReturnFailure,
                        givenCPM,
                        maxVotes,
                      });
                    },
                  }}
                />

                <TextField
                  {...{
                    label: "How much is the return in case of failure",
                    name: "CPM_return",
                    placeholder: "How much is the return in case of failure",
                    type: "number",
                    value: voteRules.CPMReturnFailure + "",
                    onChange: (e) => {
                      const { givenCPM, maxVotes, CPMReturnSuccess } =
                        voteRules;
                      setVoteRules({
                        CPMReturnFailure: e.target.value as unknown as number,
                        CPMReturnSuccess,
                        givenCPM,
                        maxVotes,
                      });
                    },
                  }}
                />
              </Row>
            </Col>
            <Col sm={6} />
          </Row>
        </Container>
      </Form>
      <Form className="mt-1" id="timeframes">
        <Container>
          <Row>
            <h4>Timeframes</h4>
            {timeframes.map((t, i) => {
              return (
                <Row key={i} id={"timeframe-" + i}>
                  <Col>
                    <TextField
                      {...{
                        label: "name",
                        name: "name",
                        placeholder: "timeframe name",
                        value: t.name,
                        onChange: (e) => {
                          submitTimeframe(
                            i,
                            e.target.value,
                            t.seconds,
                            t.chosen
                          );
                        },
                      }}
                    />
                  </Col>
                  <Col>
                    <TextField
                      {...{
                        label: "seconds",
                        name: "seconds",
                        placeholder: "seconds",
                        type: "number",
                        min: 0,
                        value: t.seconds + "",
                        onChange: (e) => {
                          submitTimeframe(
                            i,
                            t.name,
                            Number(e.target.value),
                            t.chosen
                          );
                        },
                      }}
                    />
                  </Col>
                  <Col md={1}>
                    <Form.Check
                      onChange={(e) => {
                        submitTimeframe(
                          i,
                          t.name,
                          t.seconds,
                          e.target.checked as unknown as boolean
                        );
                      }}
                      type="checkbox"
                      id={`choose-${i}`}
                      name="choose"
                      checked={t.chosen}
                    />
                  </Col>
                  <Col md={1}>
                    <Button onClick={() => removeTimeframe(i)}>
                      <i className="bi bi-trash-fill" />
                    </Button>
                  </Col>
                </Row>
              );
            })}
          </Row>
          <Row>
            <Button onClick={() => addTimeframe()} style={{ width: "auto" }}>
              <i className="bi bi-plus" />
            </Button>
          </Row>
        </Container>
      </Form>
    </>
  );
};

export default VoteRules;
