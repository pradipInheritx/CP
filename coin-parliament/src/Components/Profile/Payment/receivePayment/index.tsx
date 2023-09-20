import React, { useState } from 'react'
import PaymentComplete from './Complete'
import PaymentPending from './Pending';
import Tabs from 'Components/Profile/Tabs';
import { Form } from 'react-bootstrap';
const Index: React.FC = () => {
    const [showPendingPayment, setShowPendingPayment] = useState<boolean>(false)
    return (
        <>
            <div style={{
                width: `${window.screen.width > 767 ? "730px" : "100%"}`,
                textAlign: 'center',
                color: 'white',
                fontSize: '12px',
                margin: 'auto'
            }}>
                <div className="d-flex justify-content-sm-end justify-content-center align-items-center">
                    <Form.Check
                        className="boxCheck"
                        style={{ fontSize: "20px", marginRight: "10px", outline: 0 }}
                        type="checkbox"
                        id={`default-checkbox`}
                        onClick={() => setShowPendingPayment(prev => !prev)}
                    />
                    <label htmlFor="default-checkbox" className="custom-control-label" style={{ color: "#6352e8" }}>Show Pending Payments</label>
                </div>
            </div >
            {showPendingPayment ? <PaymentPending /> : <PaymentComplete />}
        </>
    )
}

export default Index;