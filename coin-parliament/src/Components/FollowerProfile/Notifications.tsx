import React, {useContext} from "react";
import UserContext from "../../Contexts/User";
import Notification from "./Notification";
import {useTranslation} from "../../common/models/Dictionary";
import styled from "styled-components";
import {Container} from "react-bootstrap";

const P = styled.p`
  text-align: center;
  padding: 10px;

  &:first-letter {
    text-transform: capitalize;
  }
`
const Notifications = () => {
  const {notifications} = useContext(UserContext)
  const translate = useTranslation()
  return (
    <Container className="py-4">
      {!notifications.length && <P>{translate("you have no notifications")}</P>}
      {notifications.map((notification,i) => {
        const date = (notification.time && notification.time.toDate()) || undefined;
        return <Notification key={i} date={date} title={notification.message.title} body={notification.message.body}/>;
      })}
    </Container>
  );
};

export default Notifications;
