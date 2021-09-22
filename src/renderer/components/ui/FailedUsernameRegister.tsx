import React from 'react'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles'

import red from '@material-ui/core/colors/red'

import Icon from './Icon'
import Modal from './Modal'
import LoadingButton from './LoadingButton'

import exclamationMark from '../../static/images/exclamationMark.svg'

import theme from '../../theme'

const useStyles = makeStyles(() => ({
  root: {
    padding: theme.spacing(4)
  },
  icon: {
    fontSize: '10rem',
    color: red[500],
    width: 80,
    height: 70
  },
  message: {
    wordBreak: 'break-all',
    marginTop: 36,
    fontWeight: 500
  },
  info: {
    textAlign: 'center'
  },
  button: {
    textTransform: 'none',
    width: 187,
    height: 60,
    fontSize: 16,
    lineHeight: '19px',
    fontWeight: 'normal',
    marginTop: 24
  }
}))

interface FailedUsernameRegisterProps {
  open: boolean
  handleClose: () => void
  openModalCreateUsername: () => void
}

export const FailedUsernameRegister: React.FC<FailedUsernameRegisterProps> = ({
  open = false,
  handleClose,
  openModalCreateUsername
}) => {
  const classes = useStyles({})

  return (
    <MuiThemeProvider theme={theme}>
      <Modal open={open} handleClose={handleClose} title=''>
        <Grid
          container
          justify='flex-start'
          spacing={3}
          direction='column'
          className={classes.root}>
          <Grid item container direction='column' alignItems='center'>
            <Icon className={classes.icon} src={exclamationMark} />
            <Typography variant='h3' className={classes.message}>
              Oops!
            </Typography>
          </Grid>
          <Grid item container direction='column'>
            <Grid item>
              <Typography variant='body2' className={classes.info}>
                Username didn't get registered. You are still anonymous.
              </Typography>
            </Grid>
            <Grid item container justify='center' alignItems='center'>
              <LoadingButton
                classes={{ button: classes.button }}
                text='Create a username'
                onClick={() => {
                  openModalCreateUsername()
                  handleClose()
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    </MuiThemeProvider>
  )
}

export default FailedUsernameRegister
