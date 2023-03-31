import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

function ModalForResult({ popUpOpen}: {
    popUpOpen?: any,
    
}) {
  useEffect(() => {
    if (popUpOpen) {        
      handleShow()      
    }
    
    }, [popUpOpen])
    
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
         <div>
      <Modal show={show} onHide={handleClose}       
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      >
                <Modal.Header closeButton>
                  <Modal.Title>Modal heading</Modal.Title>
                </Modal.Header>
                <Modal.Body>
          
          
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleClose}>
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>
          </div>     
  )
}

export default ModalForResult