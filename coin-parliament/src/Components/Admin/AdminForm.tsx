import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import {validateCoin, validateCoins} from "../../common/models/Coin";
import UploadCSV from "./UploadCSV";

export type AdminFormProps<T extends { id: string }> = {
  values: T[];
  setValues: (newValue: T[]) => void;
  id: string;
  topics: string[];
  upload: (results: T[]) => void;
  transform: (results: any) => T[];
  buttonTxt?: string;
  overwrite?: boolean;
};

export const AdminForm = function <T extends { id: string }>({
  values,
  setValues,
  id,
  topics,
  upload,
  transform,
  buttonTxt,
  overwrite,
}: AdminFormProps<T>) {
  const [newRow, setNewRow] = useState(false);

  const row = useMemo(() => {
    const r = {} as T;
    for (let i = 0; i < topics.length; i++) {
      const k = topics[i];
      // @ts-ignore
      r[k.toLowerCase()] = "";
    }

    return r;
  }, [topics]);

  const [newRowValue, setNewRowValue] = useState<T>(row);

  const getValue = (id: string) => {
    const index = values.findIndex((v) => v.id === id);
    const newValue = values[index];
    return { index, newValue, allValues: values.slice() };
  };

  const editValue = (
    key: string,
    id: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { index, newValue, allValues } = getValue(id);
    // @ts-ignore
    newValue[key] = e.target.value;
    allValues[index] = newValue;
    setValues(allValues);
  };

  const removeValue = (id: string) => {
    const { index, allValues } = getValue(id);
    if (index !== -1) {
      delete allValues[index];
      setValues(allValues);
      setNewRowValue(row);
    }
  };

  const addValue = useCallback(() => {
    setNewRow(true);
  }, []);

  useEffect(() => {
    if (values.length === 0) {
      setNewRow(true);
    }

    if (values.find((v) => v.id === newRowValue.id)) {
      setNewRow(false);
      setNewRowValue(row);
    }
  }, [values, newRowValue.id, row]);

  useEffect(() => {
    if (validateCoins([...values, newRowValue]) && validateCoin(newRowValue)) {
      setValues([...values, newRowValue]);
    }
  }, [newRowValue, values, setValues]);

  return (
    <Form className="mt-1" id={id}>
      <Container>
        <Table className="text-white">
          <thead>
            <tr>
              {topics.map((topic, i) => (
                <th key={i}>{topic === "ID" ? "Index" : topic}</th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody>
            {values.map((value, j) => (
              <tr key={j}>
                {topics
                  .map((t) => t.toLowerCase())
                  .map((key, i) => {
                    // @ts-ignore
                    const v = value[key.toLowerCase()];
                    return (
                      <td key={i}>
                        <Form.Control
                          id={id + "-" + (topics ? key : "") + "-" + i}
                          name={id}
                          type={
                            typeof Object.values(value)[j] === "number"
                              ? "number"
                              : "text"
                          }
                          // readOnly={key === "id"}
                          value={v || ""}
                          onChange={(e) => {
                            editValue(key, value.id, e);
                          }}
                          placeholder={`Enter ${topics[i]}`}
                        />
                      </td>
                    );
                  })}
                <td>
                  <Col md={1}>
                    <Button onClick={() => removeValue(values[j].id)}>
                      <i className="bi bi-trash-fill" />
                    </Button>
                  </Col>
                </td>
              </tr>
            ))}
            {newRow && (
              <tr>
                {topics.map((topic, i) => {
                  return (
                    <td key={i}>
                      <Form.Control
                        id={
                          id +
                          "-" +
                          (topics ? (topics[i] + "").toLowerCase() : "") +
                          "-new"
                        }
                        name={id}
                        type="text"
                        value={Object.values(newRowValue)[i]}
                        onChange={(e) => {
                          const row = {
                            ...newRowValue,
                            ...{ [topic.toLowerCase()]: e.target.value },
                          };
                          setNewRowValue(row);
                        }}
                        placeholder={`Enter ${topics[i]}`}
                      />
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </Table>
        <Row className="mb-2">
          <Col>
            <Button onClick={addValue} style={{ width: "auto" }}>
              <i className="bi bi-plus" /> Add {id}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <UploadCSV<T>
              {...{
                upload,
                transform,
                buttonTxt,
                overwrite,
                worker: true,
                config: {
                  header: true,
                },
                onUploadRejected: (file, e) => {
                  console.log(e);
                },
              }}
            />
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default AdminForm;
