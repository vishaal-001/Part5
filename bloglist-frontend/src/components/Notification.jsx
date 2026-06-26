// import './Notification.css'
import { Alert } from '@mui/material'

const Notification = ({ successMessage, errorMessage }) => {

  if (errorMessage === null && successMessage === null) {
    return null
  }

  if (errorMessage === null) {
    return <Alert severity='success'>
      {successMessage}
    </Alert>
  }

  return <Alert severity='error'>
    {errorMessage}
  </Alert>

}

export default Notification