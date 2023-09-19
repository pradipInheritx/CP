import React, { useState } from 'react'
import PaymentComplete from './Complete'
import PaymentPending from './Pending';
import Tabs from 'Components/Profile/Tabs';
const Index: React.FC = () => {
    const [activeTab, setActiveTab] = useState<number>(0)
    return (
        (activeTab ? <PaymentPending /> : <PaymentComplete />)
    )
}

export default Index;