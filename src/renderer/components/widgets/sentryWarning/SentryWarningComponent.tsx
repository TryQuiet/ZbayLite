import { Typography } from '@material-ui/core'
import React from 'react'
import Modal from '../../ui/Modal/Modal'

interface SentryWarningProps {
  open: boolean
  handleClose: () => void
}

export const SentryWarningComponent: React.FC<SentryWarningProps> = ({
  open, handleClose
}) => {
  return (
    <Modal open={open} handleClose={handleClose}>
      <Typography variant='h2'>
                Sentry is enabled
      </Typography>
    </Modal>
  )
}
