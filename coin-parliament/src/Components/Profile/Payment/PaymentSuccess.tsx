import React from 'react'

const PaymentFail: React.FC<{ paymentSuccessAction: () => void, message?: string }> = ({ paymentSuccessAction, message = 'Your payment has been confirmed' }) => {
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
                <div className="swal2-icon swal2-success swal2-icon-show" style={{ display: "flex" }}>
                    <div className="swal2-success-circular-line-left" style={{ backgroundColor: "rgb(255, 255, 255);" }}></div>
                    <span className="swal2-success-line-tip"></span> <span className="swal2-success-line-long"></span>
                    <div className="swal2-success-ring"></div> <div className="swal2-success-fix" style={{ backgroundColor: "rgb(255, 255, 255);" }}></div>
                    <div className="swal2-success-circular-line-right" style={{ backgroundColor: "rgb(255, 255, 255);" }}></div>
                </div>
                <div style={{
                    fontSize: '1.875em',
                    fontWeight: '600',
                    textAlign: 'center',
                }}>Payment Successful</div>
                <div style={{
                    fontSize: '1.125em',
                    fontWeight: 'normal',
                    lineHeight: 'normal',
                    textAlign: 'center',
                    margin: '1em 1.6em .3em',
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
                        onClick={paymentSuccessAction}
                    >Close</button>
                </div>
            </div>

        </div>
    )
}

export default PaymentFail;