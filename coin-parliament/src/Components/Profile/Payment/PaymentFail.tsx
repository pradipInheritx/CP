import React from 'react'

const PaymentFail: React.FC<{ tryAgainAction: () => void, startAgainAction: () => void, message?: string }> = ({ tryAgainAction, startAgainAction, message = 'Insufficient balance' }) => {
    return (
        <div className='w-100 d-flex justify-content-center'>
            <div style={{
                backgroundColor: 'white',
                boxSizing: 'border-box',
                gridTemplateColumns: 'minmax(0, 100%)',
                width: '32em',
                maxWidth: '100%',
                padding: '0 0 1.25em',
                border: 'none',
                borderRadius: '5px',
                background: '#fff',
                color: '#545454',
                fontFamily: 'inherit',
                fontSize: '1rem',
                display: 'grid',
                gridColumn: '2',
                gridRow: '2',
                alignSelf: 'center',
                justifySelf: 'center',
            }}>
                <div className="swal2-icon swal2-error swal2-icon-show" style={{ display: "flex" }}>
                    <span className="swal2-x-mark">
                        <span className="swal2-x-mark-line-left"></span>
                        <span className="swal2-x-mark-line-right"></span>
                    </span>
                </div>
                <div style={{
                    fontSize: '1.875em',
                    fontWeight: '600',
                    textAlign: 'center',
                }}>Payment Failed</div>
                <div style={{
                    fontSize: '1.125em',
                    fontWeight: 'normal',
                    lineHeight: 'normal',
                    textAlign: 'center',
                    margin: '1em 1.6em 1.3em',
                    padding: '0'
                }}>
                    {message}
                </div>
                <div className='d-flex justify-content-center'>
                    <button type="button"
                        style={{
                            display: 'inline-block',
                            backgroundColor: 'rgb(84, 60, 214)',
                            border: '0',
                            borderRadius: '0.25em',
                            color: 'white',
                            fontSize: '1em',
                            margin: '.3125em',
                            padding: '.625em 1.1em',
                            transition: 'box-shadow .1s',
                            boxShadow: '0 0 0 3px rgba(0,0,0,0)',
                            fontWeight: '500',
                        }}
                        onClick={tryAgainAction}
                    >
                        Try again
                    </button>
                    <button type="button"
                        style={{
                            display: 'inline-block',
                            backgroundColor: '#dd3333',
                            border: '0',
                            borderRadius: '0.25em',
                            color: 'white',
                            fontSize: '1em',
                            margin: '.3125em',
                            padding: '.625em 1.1em',
                            transition: 'box-shadow .1s',
                            boxShadow: '0 0 0 3px rgba(0,0,0,0)',
                            fontWeight: '500',
                        }}
                        onClick={startAgainAction}
                    >Start Over Again</button>
                </div>
            </div>

        </div>
    )
}

export default PaymentFail;