import React from "react";
import styled from "styled-components";
import moment from "moment";

type NotificationProps = {
  date?: Date;
  title: string;
  body: string;
}

const Container = styled.div`
  width: 100%;
  max-width: 360px;
  height: auto;
  background: var(--white) 0 0% no-repeat padding-box;
  box-shadow: 0 3px 6px #00000029;
  border-radius: 6px;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 15px;
  margin: 0 auto 1px;
`;
const Date = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal) var(--font-size-12)/var(--line-spacing-10) var(--font-family-poppins);
  font-size: var(--font-size-12);
  letter-spacing: var(--character-spacing-0);
  line-height: var(--line-spacing-10);
  color: var(--color-868686);
  text-align: left;
  opacity: 1;
  width:96px;
  line-height: 16px;  
`;

const Msg = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width:204px;
  line-height: var(--line-spacing-10);
  >div>* {
    display: inline;
  }
`;

const Title = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal) var(--font-size-12)/var(--line-spacing-14) var(--font-family-poppins);
  font-size: var(--font-size-12);
  letter-spacing: var(--character-spacing-0);
  line-height: var(--line-spacing-10);
  color: var(---160133);
  text-align: left;
  opacity: 1;
  font-weight: 500;
  margin-right: 2px;
  line-height: 16px;  
  
`;

const Body = styled.div`
  font: var(--font-style-normal) normal var(--font-weight-normal) var(--font-size-12)/var(--line-spacing-14) var(--font-family-poppins);
  font-size: var(--font-size-12);
  line-height: var(--line-spacing-10);
  letter-spacing: var(--character-spacing-0);
  color: var(---160133);
  text-align: left;
  opacity: 1;
  line-height: 16px;  
`;

const Notification = ({ date, title, body }: NotificationProps) => {
  return (
    <Container className="mt-2">
      <Date>{date && moment(date).format("HH:mm DD.MM.YYYY")}</Date>
      <Msg>
        <div>
          <Title>{title}</Title>
          <br />
          <br />
          <Body>{body}</Body>
        </div>
      </Msg>
    </Container>
  );
};

export default Notification;
