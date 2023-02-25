// ** Third Party Components
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export const handleSuccessAlert = (title, text, callbackFunction) => {
  return MySwal.fire({
    title: title ? title : 'Good job!',
    text: text ? text : 'You clicked the button!',
    icon: 'success',
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  }).then(callbackFunction)
}

export const handleInfoAlert = (title, text, callbackFunction) => {
  return MySwal.fire({
    title: title ? title : 'Info!',
    text: text ? text : 'You clicked the button!',
    icon: 'info',
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  }).then(callbackFunction)
}

export const handleErrorAlert = (title, text, callbackFunction) => {
  return MySwal.fire({
    title: title ? title : 'Error!',
    text: text ? text : ' You clicked the button!',
    icon: 'error',
    customClass: {
      confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  }).then(callbackFunction)
}

export const handleWarningAlert = (title, text, callbackFunction) => {
  return MySwal.fire({
    title: title ? title : 'Warning!',
    text: text ? text : ' You clicked the button!',
    icon: 'warning',
    customClass: {
        confirmButton: 'btn btn-primary'
    },
    buttonsStyling: false
  }).then(callbackFunction) 
}