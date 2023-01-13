import React, { useContext } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import TextField from "./Textfield";
import AppContext from "../../Contexts/AppContext";
import uniq from "lodash/uniq";
import {
  Colors,
  defaultUserType,
  UserTypeProps,
} from "../../common/models/UserType";

const CPMSettings = () => {
  const { CPMSettings, setCPMSettings, userTypes, setUserTypes } =
    useContext(AppContext);

  const submitUserType = (userType: UserTypeProps) => {
    const u = [...userTypes];

    u.splice(userType.index, 1, userType);

    setUserTypes(uniq(u));
  };

  const removeUserType = (i: number) => {
    const u = [...userTypes];
    u.splice(i, 1);
    if (!u.length) {
      u.push(defaultUserType);
    }
    setUserTypes(u);
  };

  const addUserType = () => {
    const currentLength = userTypes.length;
    if (!currentLength) {
      setUserTypes([]);
    }
    setUserTypes([
      ...userTypes,
      {
        index: currentLength,
        name: "",
        givenCPM: 0,
        weight: 0,
        color: "" as Colors,
        share: 0,
      },
    ]);
  };

  return (
    <Form className="mt-1">
      <Container>
        <Row>
          <TextField
            {...{
              edit:false,
              label: "CPM given to signup referral",
              name: "signup_referral",
              placeholder: "CPM given to signup referral",
              type: "number",
              value: CPMSettings.signupReferral + "",
              onChange: (e) => {
                const { pctReferralActivity, orderBookWeight } = CPMSettings;
                setCPMSettings({
                  signupReferral: e.target.value as unknown as number,
                  pctReferralActivity,
                  orderBookWeight,
                });
              },
            }}
          />

          <TextField
            {...{
              edit:false,
              label: "% for each referral activity",
              name: "pct_referral_activity",
              placeholder: "% for each referral activity",
              type: "number",
              value: CPMSettings.pctReferralActivity + "",
              onChange: (e) => {
                const { signupReferral, orderBookWeight } = CPMSettings;
                setCPMSettings({
                  signupReferral,
                  pctReferralActivity: e.target.value as unknown as number,
                  orderBookWeight,
                });
              },
            }}
          />

          <TextField
            {...{
              edit:false,
              label: "order book's weight in CPVI calculation",
              name: "order_book_weight",
              placeholder: "order book's weight in CPVI calculation",
              type: "number",
              max: 1,
              min: 0,
              step: 0.1,
              value: (CPMSettings.orderBookWeight || 0) + "",
              onChange: (e) => {
                const { signupReferral, pctReferralActivity } = CPMSettings;
                setCPMSettings({
                  signupReferral,
                  pctReferralActivity,
                  orderBookWeight: e.target.value as unknown as number,
                });
              },
            }}
          />

          <h4>Given CPM according to the user type for each vote</h4>
          <Container className="table-responsive">
            <Table bordered hover className="table align-middle text-white">
              <thead>
                <tr>
                  <th>
                    <Row>
                      <Col>name</Col>
                    </Row>
                  </th>
                  <th>
                    <Row>
                      <Col>weight</Col>
                    </Row>
                  </th>
                  <th>
                    <Row>
                      <Col>given CPM</Col>
                    </Row>
                  </th>
                  <th>
                    <Row>
                      <Col>share (%)</Col>
                    </Row>
                  </th>
                  <th>
                    <Row>
                      <Col>color</Col>
                    </Row>
                  </th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {userTypes.map((u, i) => {
                  const { share, color, givenCPM, index, name, weight } =
                    userTypes[i];
                  return (
                    <tr key={`userType-${i}`} id={`userType-${i}`}>
                      <td>
                        <TextField
                          {...{
                            edit:false,
                            name: "name",
                            placeholder: "userType name",
                            value: u.name,
                            onChange: (e) => {
                              submitUserType({
                                color,
                                givenCPM,
                                index: i,
                                name: e.target.value as unknown as string,
                                weight,
                                share,
                              });
                            },
                          }}
                        />
                      </td>
                      <td>
                        <TextField
                          {...{
                            name: "weight",
                            placeholder: "userType weight",
                            value: u.weight + "",
                            type: "number",
                            min: 0,
                            onChange: (e) => {
                              submitUserType({
                                color,
                                givenCPM,
                                index,
                                name,
                                share,
                                weight: e.target.value as unknown as number,
                              });
                            },
                          }}
                        />
                      </td>
                      <td>
                        <TextField
                          {...{
                            name: "given_cpm",
                            placeholder: "given CPM",
                            value: u.givenCPM + "",
                            type: "number",
                            min: 0,
                            onChange: (e) => {
                              submitUserType({
                                color,
                                givenCPM: e.target.value as unknown as number,
                                index,
                                name,
                                weight,
                                share,
                              });
                            },
                          }}
                        />
                      </td>
                      <td>
                        <TextField
                          {...{
                            name: "share",
                            placeholder: "share (%)",
                            value: u.share + "",
                            type: "number",
                            min: 0,
                            onChange: (e) => {
                              const props = {
                                color,
                                givenCPM,
                                index,
                                name,
                                weight,
                                share: e.target.value as unknown as number,
                              };
                              submitUserType(props);
                            },
                          }}
                        />
                      </td>
                      <td>
                        <Form.Group className="mb-3 d-flex" controlId="color">
                          <Form.Select
                            value={color}
                            onChange={(e) =>
                              submitUserType({
                                color: e.target.value as unknown as Colors,
                                givenCPM,
                                index,
                                name,
                                weight,
                                share,
                              })
                            }
                          >
                            <option>Open this select menu</option>
                            {Object.keys(Colors).map((c, i) => {
                              return (
                                <option value={i} key={i}>
                                  {
                                    Object.values(Colors)[
                                      Object.keys(Colors).findIndex(
                                        (co) => co === c
                                      )
                                    ]
                                  }
                                </option>
                              );
                            })}
                          </Form.Select>
                        </Form.Group>
                      </td>
                      <td>
                        <Button onClick={() => removeUserType(i)}>
                          <i className="bi bi-trash-fill" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Container>
        </Row>
        <Row>
          <Button onClick={() => addUserType()} style={{ width: "auto" }}>
            <i className="bi bi-plus" />
          </Button>
        </Row>
      </Container>
    </Form>
  );
};

export default CPMSettings;
