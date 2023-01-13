import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import TextField from "./Textfield";
import uniq from "lodash/uniq";

export type AdminAvatar = {
  image: string;
  description: string;
  video: string;
  name: string;
  chosen: boolean;
};
const Avatars = () => {
  const [avatars, setAvatars] = useState<AdminAvatar[]>([] as AdminAvatar[]);

  const submitAvatar = (i: number, avatar: AdminAvatar) => {
    const newAvatars = [...avatars];

    newAvatars.splice(i, 1, avatar);

    setAvatars(uniq(newAvatars));
  };

  const removeAvatar = (i: number) => {
    const t = [...avatars];
    t.splice(i, 1);
    if (!avatars.length) {
      t.push({
        image: "",
        description: "",
        video: "",
        name: "",
        chosen: false,
      });
    }
    setAvatars(t);
  };

  const addAvatar = () => {
    setAvatars([
      ...avatars,
      {
        image: "",
        description: "",
        video: "",
        name: "",
        chosen: false,
      },
    ]);
  };

  return (
    <>
      <Form className="mt-1" id="timeframes">
        <Container>
          <Row>
            <h4>Avatars</h4>
            {avatars.map((t, i) => {
              return (
                <Row key={i} id={"timeframe-" + i}>
                  <Col>
                    <TextField
                      {...{
                        label: "name",
                        name: "name",
                        placeholder: "name",
                        value: t.name,
                        onChange: (e) => {
                          submitAvatar(i, {} as AdminAvatar);
                        },
                        edit:false
                      }}
                    />
                  </Col>
                  <Col>
                    <TextField
                      {...{
                        label: "image",
                        name: "image",
                        placeholder: "image",
                        type: "number",
                        min: 0,
                        value: t.image,
                        onChange: (e) => {
                          submitAvatar(i, {} as AdminAvatar);
                        },
                        edit:false
                      }}
                    />
                  </Col>
                  <Col>
                    <TextField
                      {...{
                        label: "video",
                        name: "video",
                        placeholder: "video",
                        value: t.video,
                        onChange: (e) => {
                          submitAvatar(i, {} as AdminAvatar);
                        },
                        edit:false
                      }}
                    />
                  </Col>
                  <Col>
                    <TextField
                      {...{
                        label: "description",
                        name: "description",
                        placeholder: "description",
                        value: t.description,
                        onChange: (e) => {
                          submitAvatar(i, {} as AdminAvatar);
                        },
                        edit:false
                      }}
                    />
                  </Col>
                  <Col md={1}>
                    <Form.Check
                      onChange={(e) => {
                        submitAvatar(i, {} as AdminAvatar);
                      }}
                      type="checkbox"
                      id={`choose-${i}`}
                      name="choose"
                      checked={t.chosen}
                    />
                  </Col>
                  <Col md={1}>
                    <Button onClick={() => removeAvatar(i)}>
                      <i className="bi bi-trash-fill" />
                    </Button>
                  </Col>
                </Row>
              );
            })}
          </Row>
          <Row>
            <Button onClick={() => addAvatar()} style={{ width: "auto" }}>
              <i className="bi bi-plus" />
            </Button>
          </Row>
        </Container>
      </Form>
    </>
  );
};

export default Avatars;
