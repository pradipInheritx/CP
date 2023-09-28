import { texts } from 'Components/LoginComponent/texts';
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import { ButtonGroup } from "react-bootstrap";
import Button from "Components/Atoms/Button/Button";
import moment from 'moment';

const RewardList = styled.p`
  font-size: 10px;
  color: white;
  cursor: pointer;   
   padding:15px;   
`;
// const tableHeader = ["Transaction id", "Date", "Item", "Amount", "Payment method"];
export type tableColumnType = {
    title: string;
    assessorName: string;
    Row?: React.FC<{ value: any, data?: any }>;
}



interface TableType<T> {
    data: T[];
    headers: tableColumnType[];
    pagination?: boolean;
}
const Index = <T,>({ data, headers, pagination = true }: TableType<T>) => {
    const [pageIndex, setPageIndex] = useState(1);
    return (
        <>
            <div className='d-flex justify-content-around w-100 py-3' style={{ background: "#7456ff" }}>
                {
                    headers.map((item: tableColumnType, index: number) => {
                        return (<div style={{ width: `19%` }}>
                            <strong>{item?.title}</strong>
                        </div>)
                    })
                }
            </div>
            {data.map((value: any, index: number) => {
                return (
                    <div className='d-flex justify-content-around' key={index} style={{ textAlign: "center", }}>
                        {
                            headers.map((item: tableColumnType, i: number) => {
                                return (
                                    <div style={{ width: "19%" }} key={i}>
                                        <RewardList>
                                            {item?.Row ?
                                                <item.Row value={value[item?.assessorName]} />
                                                : (value[item?.assessorName] || "NA")}
                                        </RewardList>
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            })}

            {!data?.length && (
                <div className='d-flex justify-content-around w-100 mt-4'>
                    {
                        headers.map(() => {
                            return (
                                <div className=''
                                    style={{
                                        width: `${(100 / headers.length) - 1}`,
                                    }}
                                >
                                    <RewardList>-</RewardList>
                                </div>)
                        })
                    }
                </div>
            )}
            {pagination && <>
                <ButtonGroup>
                    <Button
                        disabled={pageIndex === 1}
                        onClick={() => setPageIndex(prev => prev - 1)}
                        style={{ marginRight: '1em' }}
                    >
                        {texts.Prev}
                    </Button>
                    <Button
                        disabled={
                            true
                            // pageIndex * 5 >= totalData
                        }
                        onClick={() => setPageIndex(prev => prev + 1)}
                    >
                        {texts.Next}
                    </Button>
                </ButtonGroup>
            </>}
        </>
    )
}

export default Index;