
import UserContext from 'Contexts/User';
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'

const WalletBalance = () => {    
    const [pendingAmount, setPendingAmount] = useState({
        
    })
    const { userInfo, user } = useContext(UserContext);
    useEffect(() => {
        // getPendingAmount()
    }, [])

    // const getPendingAmount = () => {
    //     axios.get(`/payment/getInstantReferalAmount/${user?.uid}`)
    //         .then(async (response) => {
    //             setPendingAmount(response.data.data)                
    //         })
    //         .catch((error) => {
    //             console.log(error,"error")
    //         })
    // }     

  return (
      <div className='d-flex justify-content-center align-items-center'            
      >
          <div className='mt-3'>              
              <p className='mx-3' style={{
              fontSize:"18px"
          }}>Your Referral Pending Amount</p>
              {Object.keys(pendingAmount).length ?                  
                  <div className='d-flex justify-content-center align-items-center flex-column'>
                      {Object.keys(pendingAmount).map((value, index) => {
                        
                          return <>
                              {/* @ts-ignore */}
                              <p>{value} : {pendingAmount[value]}</p>
                          </>
                      })
                    }
                  </div>
                  :
                  <div className="d-flex justify-content-center" >
                      <p className='mt-3'>Pending Payment Amount is not found</p>
                  </div>
                  
              }
          </div>
      </div>
  )
}

export default WalletBalance