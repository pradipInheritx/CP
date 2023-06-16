import React, { useEffect, useState } from 'react'
import { TimeFrame } from './models/Vote';
import { handleSoundClick } from './utils/SoundClick';
import { CountdownCircleTimer, TimeProps } from 'react-countdown-circle-timer';

const VoteTimeCircle: React.FC<{
    selectTimeframe: (timeframe: TimeFrame) => void,
    checked: boolean,
    timeframe: TimeFrame,
    voteDetails: any
}> = ({ selectTimeframe, checked, timeframe, voteDetails }) => {

    const [seconds, setSeconds] = useState<number>(0);
    useEffect(() => {
        let current = new Date();
        // voteTime date
        let voteTime = new Date(voteDetails?.expiration);
        // finding the difference in total seconds between two dates
        let second_diff = (voteTime.getTime() - current.getTime()) / 1000;
        setSeconds(second_diff);
    }, [voteDetails])
    return (
        <div
            style={{
                width: "70px",
                height: "70px",
                borderRadius: "70px",
                boxShadow: "0 3px 6px #00000029",
                paddingTop: "0px",
                cursor: "pointer",
                backgroundColor: (checked ? '#6352e8' : '')
            }}
        // onClick={() => {
        //     selectTimeframe(timeframe);
        //     handleSoundClick()
        // }}
        >

            {seconds ? <CountdownCircleTimer
                isPlaying={true}
                strokeWidth={3}
                colors={(checked ? '#fff' : '#6352e8')}
                rotation={"counterclockwise"}
                duration={timeframe.seconds}
                initialRemainingTime={seconds}
                onComplete={() => {
                    // do your stuff here
                    // return { shouldRepeat: true } // repeat animation in 1.5 seconds
                }}
                trailColor={(checked ? '#6352e8' : '#fff')}
                size={70}

            >
                {({ elapsedTime }: TimeProps) => {
                    return (
                        <span style={{ color: (checked ? '#fff' : '#6352e8'), fontSize: "14px" }}>{timeframe.name} {/* {Math.floor(timeframe.seconds - elapsedTime)} */}</span>
                    );
                }}
            </CountdownCircleTimer> :
                <span className='flex justify-content-center' style={{
                    display: 'flex',
                    textAlign: 'center',
                    height: '100%',
                    flexDirection: 'column',
                    color: (checked ? '#fff' : '#6352e8'),
                    fontSize: "14px"
                }}>{timeframe.name}</span>}
        </div >
    )
}

export default VoteTimeCircle