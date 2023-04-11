import React, {useContext, useEffect} from "react";
import UserContext from "../../Contexts/User";
import Notification from "./Notification";
import {useTranslation} from "../../common/models/Dictionary";
import styled from "styled-components";
import {Container} from "react-bootstrap";
import { NotificationWait } from "../../common/utils/SoundClick";

const P = styled.p`
  text-align: center;
  padding: 10px;

  &:first-letter {
    text-transform: capitalize;
  }
`
const Notifications = () => {
  const { notifications } = useContext(UserContext)
  useEffect(() => {
    
    if (notifications.length) {
    NotificationWait()
  }
 
  }, [notifications])
  
  const translate = useTranslation()
  return (
    <Container className="py-4">
      {!notifications.length && <P>{translate("you have no notifications")}</P>}
      {notifications.map((notification,index) => {
        const date = (notification.time && notification.time.toDate()) || undefined;
        return <Notification date={date} title={notification.message.title} body={notification.message.body} key={index} />;
      })}
    </Container>
  );
};

export default Notifications;
