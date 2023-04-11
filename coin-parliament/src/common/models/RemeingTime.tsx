import React, { useContext } from 'react'
import Countdown from 'react-countdown';
import AppContext from '../../Contexts/AppContext';

function RemeingTime() {
    const {remainingTimer } = useContext(AppContext);
  return (
      <div>
          <Countdown date={remainingTimer} 
                renderer={({ hours, minutes, seconds, completed }) => {                        
                return (
                <span className="text-uppercase" style={{color:'#6352e8',fontSize:'10px',fontWeight:400}}>
                    {/* {hours < 10 ? `0${hours}` : hours}: */}                              
                    {hours < 1 ? null : `${hours} :` }
                    {minutes < 10 ? `0${minutes}` : minutes}:
                    {seconds < 10 ? `0${seconds}` : seconds}                                
                </span>
                );
            
            }}
        />
    </div>
  )
}

export default RemeingTime