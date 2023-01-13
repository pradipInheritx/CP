import React, { useState } from "react";
import { ChartTimeFrames } from "../../common/models/CPVI";
import { Col, Container, Form, Row } from "react-bootstrap";

const CPVIChart = () => {
  const [timeframe, setTimeframe] = useState<ChartTimeFrames>();
  return (
    <>
      <Form>
        <Container className="d-flex justify-content-md-start">
          <Row>
            {Object.keys(ChartTimeFrames).map((chartTimeFrame, i) => (
              <Col key={`chartTimeFrame-${chartTimeFrame}`}>
                <Form.Check
                  type="radio"
                  id={`chartTimeFrame-${chartTimeFrame}`}
                  label={Object.values(ChartTimeFrames)[i]}
                  checked={timeframe === Object.values(ChartTimeFrames)[i]}
                  onClick={() =>
                    setTimeframe(Object.values(ChartTimeFrames)[i])
                  }
                />
              </Col>
            ))}
          </Row>
        </Container>
      </Form>
    </>
  );
};

export default CPVIChart;
