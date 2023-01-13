import React, { useContext, useState } from "react";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import AppContext from "../../Contexts/AppContext";
import { ENGLISH, useTranslation } from "../../common/models/Dictionary";
import { uniq } from "lodash";
import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const exportToCsv = (filename: string, rows: string[][]) => {
  let csvContent = rows.map((e) => e.join(",")).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

const AdminDictionary = () => {
  const {
    languages,
    setLanguages,
    translations,
    setTranslations,
    rtl,
    setRtl,
  } = useContext(AppContext);
  const [currentLanguage, setCurrentLanguage] = useState<string>(
    languages.length ? languages[0] : ENGLISH
  );
  const translate = useTranslation();

  const [newKey, setNewKey] = useState<string | undefined>(undefined);
  const [newValue, setNewValue] = useState<string | undefined>(undefined);
  const [updated, setUpdated] = useState<boolean>(false);
  const updateLanguages = async (newLanguages: string[]) => {
    setLanguages(newLanguages);
    newLanguages = newLanguages.filter((l) => l);
    await setDoc(doc(db, "settings", "languages"), { languages: newLanguages });
  };

  const removeLanguage = async (
    i: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const newLanguages = [...languages];
    newLanguages.splice(i, 1);
    if (!newLanguages.length) {
      newLanguages.push(ENGLISH);
      setCurrentLanguage(ENGLISH);
    }

    if (newLanguages.length === 1) {
      await updateLanguages([ENGLISH]);
      setCurrentLanguage(ENGLISH);
      return;
    }
    await updateLanguages(newLanguages);
  };

  const addLanguage = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const newLanguages = [...languages];
    newLanguages.push("");
    await updateLanguages(newLanguages);
  };

  const editLanguage = async (
    i: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    const newLanguages = [...languages];
    newLanguages.splice(i, 1, e.target.value.toLowerCase());
    await updateLanguages(uniq(newLanguages.map((l) => l.toLowerCase())));
  };

  const editTranslation = (
    i: number | undefined,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    e.preventDefault();
    if (typeof i === "number") {
      const key = Array.from(translations.keys())[i];
      const currentTranslations = translations.get(key) || {};
      currentTranslations[currentLanguage] = e.target.value.toLowerCase();
      translations.set(key, currentTranslations);
      setTranslations(translations);
      setUpdated(!updated);
    } else {
      if (
        newKey &&
        !Array.from(translations.keys()).includes(newKey.toLowerCase())
      ) {
        const ts = {} as { [key: string]: string };
        languages.forEach((language) => {
          ts[language] = language === currentLanguage ? e.target.value : "";
        });
        translations.set(newKey.toLowerCase(), ts);
        setNewKey(undefined);
        setNewValue("");
        setTranslations(translations);
        setUpdated(!updated);
      } else {
        setNewValue(e.target.value);
      }
    }
  };

  const removeTranslation = (
    i: number | undefined,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (typeof i === "number") {
      const key = Array.from(translations.keys())[i];
      translations.delete(key);
      setTranslations(translations);
      setUpdated(!updated);
    } else {
      setNewKey(undefined);
      setNewValue("");
    }
  };

  const addTranslation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setNewKey("");
    setNewValue("");
  };

  const uploadCSV = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {};

  const downloadCsvEmpty = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const result = await getDocs(collection(db, "translations"));
    exportToCsv(currentLanguage, [result.docs.map((doc) => doc.id)]);
  };

  const downloadCsvPopulated = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const result = await getDocs(collection(db, "translations"));
    exportToCsv(
      currentLanguage,
      result.docs.map((doc) => {
        const data = doc.data() || {};
        const values = data[currentLanguage] || [];
        return [doc.id, values];
      })
    );
  };

  const values =
    Array.from(translations.values())
      .map((v) => v[currentLanguage])
      .filter((v) => v) || [];

  return (
    <Form className="mt-1" id="languages">
      <Container>
        <Row>
          <Col>
            <h3 className="mt-2 mb-2 text-capitalize">
              {translate("Language")}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col>
            <Table className="text-white">
              <thead>
                <tr>
                  <th>{translate("name")}</th>
                  <th>{translate("rtl")}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {languages.map((l, i) => {
                  return (
                    <tr key={i}>
                      <td>
                        <Form.Group className="mb-3" controlId="language">
                          <Form.Control
                            type="text"
                            value={l}
                            onChange={(e) => editLanguage(i, e)}
                            placeholder="Language"
                            pattern="[a-z0-9]+"
                          />
                        </Form.Group>
                      </td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          id={`rtl-${l}`}
                          name="rtl"
                          value={l}
                          defaultChecked={rtl.includes(l)}
                          onChange={async () => {
                            const newRtl = Array.from(
                              document.forms
                                ?.namedItem("languages")
                                ?.elements?.namedItem("rtl") as RadioNodeList
                            )
                              .filter((v) => (v as HTMLInputElement).checked)
                              .map((v) => (v as HTMLInputElement).value);
                            setRtl(newRtl);

                            await setDoc(doc(db, "settings", "rtl"), {
                              rtl: newRtl,
                            });
                          }}
                        />
                      </td>
                      <td>
                        <Button onClick={(e) => removeLanguage(i, e)}>
                          <i className="bi bi-trash-fill" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button onClick={addLanguage} style={{ width: "auto" }}>
              <i className="bi bi-plus" /> Add Language
            </Button>
          </Col>
        </Row>
      </Container>
      <hr />
      <Container>
        <Row>
          <Col>
            <h3 className="mt-2 mb-2 text-capitalize">
              {translate("Translations")}
            </h3>
          </Col>
        </Row>
        <Row>
          <Col className="mb-1">
            <Form.Select
              aria-label="language translations"
              value={currentLanguage}
              onChange={(e) => {
                setCurrentLanguage(e.target.value);
              }}
            >
              {languages.map((l, i) => {
                return (
                  <option key={i} value={l} className="text-capitalize">
                    {l}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </Row>

        <Row>
          <Col>
            {!values.length && newKey === undefined && (
              <Row>
                <Col>
                  <Row className="mb-1">
                    <Col>No keys for this language</Col>
                  </Row>
                  <Row className="mb-1">
                    <Col>
                      <Button
                        onClick={addTranslation}
                        style={{ width: "auto" }}
                      >
                        <i className="bi bi-plus" /> Add Translation
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col>
                      <Button onClick={downloadCsvEmpty}>
                        Download empty csv with list of keys
                      </Button>
                    </Col>
                  </Row>
                  <Row className="mb-1">
                    <Col>
                      <Button onClick={downloadCsvPopulated}>
                        Download populated csv with list of keys and values
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            )}
            {(values.length > 0 || newKey !== undefined) && (
              <Container className="table-responsive mb-1 p-0">
                <Table>
                  <thead>
                    <tr>
                      <th>Key</th>
                      <th>translation</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {values.map((key, i) => {
                      return (
                        <tr key={i}>
                          <td>{Array.from(translations.keys())[i]}</td>
                          <td>
                            <Form.Group className="mb-3">
                              <Row>
                                <Col>
                                  <Form.Control
                                    id={`translations-${key}-${i}`}
                                    name="translations"
                                    type="text"
                                    value={key}
                                    onChange={(e) => editTranslation(i, e)}
                                    placeholder={`Enter translation for "${key}"`}
                                  />
                                </Col>
                              </Row>
                            </Form.Group>
                          </td>
                          <td>
                            <Col md={1}>
                              <Button onClick={(e) => removeTranslation(i, e)}>
                                <i className="bi bi-trash-fill" />
                              </Button>
                            </Col>
                          </td>
                        </tr>
                      );
                    })}
                    <>
                      {newKey !== undefined && (
                        <tr>
                          <td>
                            <Row>
                              <Col>
                                <Form.Control
                                  id={`translations-newKey`}
                                  name="translations"
                                  type="text"
                                  value={newKey}
                                  onChange={(e) => setNewKey(e.target.value)}
                                  placeholder={`Enter a key`}
                                />
                              </Col>
                            </Row>
                          </td>
                          <td>
                            <Row>
                              <Col>
                                <Form.Control
                                  id={`translations-newValue`}
                                  name="translations"
                                  type="text"
                                  value={newValue}
                                  onChange={(e) =>
                                    editTranslation(undefined, e)
                                  }
                                  placeholder={`Enter translation for "${newKey}"`}
                                />
                              </Col>
                            </Row>
                          </td>
                          <td>
                            <Col md={1}>
                              <Button
                                onClick={(e) => removeTranslation(undefined, e)}
                              >
                                <i className="bi bi-trash-fill" />
                              </Button>
                            </Col>
                          </td>
                        </tr>
                      )}
                    </>
                  </tbody>
                </Table>
                <Row>
                  <Col>
                    <Button onClick={addTranslation} style={{ width: "auto" }}>
                      <i className="bi bi-plus" /> Add Translation
                    </Button>
                  </Col>
                </Row>
              </Container>
            )}
          </Col>
        </Row>
        <Row className="mb-1">
          <Col>
            <Button onClick={uploadCSV}>Upload csv file of keys</Button>
          </Col>
        </Row>
      </Container>
    </Form>
  );
};

export default AdminDictionary;
