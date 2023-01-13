import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Button } from '@material-ui/core';

const MySwal = withReactContent(Swal);

const CustomHtmlMessage = () => {
  const sweetAlerts = () => {
    MySwal.fire({
      title: '<strong>HTML <u>example</u></strong>',
      icon: 'info',
      html: 'You can use <b>bold text</b>, <a href="//sweetalert2.github.io">links</a> and other HTML tags',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Great!',
      confirmButtonAriaLabel: 'great!',
      cancelButtonText: 'Cancel',
      cancelButtonAriaLabel: 'cancel',
    });
  };
  return (
    <Button variant="outlined" color="primary" onClick={sweetAlerts}>
      Click me
    </Button>
  );
};

export default CustomHtmlMessage;
