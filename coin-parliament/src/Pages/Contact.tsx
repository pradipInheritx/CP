import React, {useContext, useState} from "react";
import GeneralPage from "../GeneralPage";
import {Form} from "react-bootstrap";
import {Buttons} from "../Components/Atoms/Button/Button";
import {httpsCallable} from "firebase/functions";
import {functions} from "../firebase";
import Spinner from "../Components/Spinner";
import styled from "styled-components";
import NotificationContext, {ToastType} from "../Contexts/Notification";
import {Link} from "react-router-dom";

const sendEmail = httpsCallable(functions, "sendEmail");

const Container = styled.div`
  background: #D4D0F3;
  height: 282px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  padding: 34px;
  text-align: center;

  & h2 {
    color: #6352E8;
    font-size: 17px;
    margin-bottom: 20px;
  }

  & p {
    color: #160133;
    font-size: 16px;
  }
`;

const Back = styled.div`
  padding: 36px;
  text-align: center;

  & a {
    font-size: 16px;
    color: #6352E8;
  }
`;
const Contact = () => {
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const {showToast} = useContext(NotificationContext);

  return (
    <GeneralPage>
      <div className="m-auto" style={{width:`${window.screen.width>767?"40%":"100%"}`}}>
      {!sent && (<React.Fragment>
        <h1>Contact Us</h1>
        {sending && (
          <Spinner/>
        )}
        {!sending && (
          <Form onSubmit={async e => {
            e.preventDefault();
            try {
              setSending(true);
              await sendEmail({name, subject, message});
              setSending(false);
              setSent(true);
            } catch (e) {
              setSending(false);
              showToast((e as Error).message, ToastType.ERROR);
            }
          }}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Control type="text" placeholder="YourName" value={name} onChange={(e) => setName(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="subject">
              <Form.Control type="text" placeholder="Subject" value={subject}
                            onChange={(e) => setSubject(e.target.value)}/>
            </Form.Group>
            <Form.Group className="mb-3" controlId="message">
              <Form.Control as="textarea" rows={3} value={message} onChange={(e) => setMessage(e.target.value)}/>
            </Form.Group>
            <Buttons.Primary fullWidth={true} type="submit">
              Send
            </Buttons.Primary>
          </Form>
        )}
      </React.Fragment>)}
      {sent && (<React.Fragment>
        <Container>
          <h2>THANK YOU FOR CONTACTING US.</h2>
          <p>You will receive a response with in 24hrs.</p>
        </Container>
        <Back>
          <Link to={"/"}>Go back to homepage</Link>
        </Back>
        </React.Fragment>)}
        </div>
    </GeneralPage>
  );
};

export default Contact;
