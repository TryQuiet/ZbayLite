import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

import SpinnerLoader from '../../ui/Spinner/SpinnerLoader'
import Modal from '../../ui/Modal/Modal'

const useStyles = makeStyles(theme => ({
  spinner: {
    top: '50%',
    position: 'relative',
    transform: 'translate(0, -50%)'
  }
}))

const LoadingPanelComponent = ({
  open,
  handleClose,
  isClosedDisabled = true,
  message
}) => {
  const classes = useStyles({})

  return (
    <Modal open={open} handleClose={handleClose} isCloseDisabled={isClosedDisabled} >
      <SpinnerLoader
        size={40}
        message={message}
        color={'black'}
        className={classes.spinner}
      />
    </Modal>
  )
}

export default LoadingPanelComponent
