import React from 'react'

import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import classNames from 'classnames'

import theme from '../../theme'

const useStyles = makeStyles({
  button: {
    maxWidth: 286,
    height: 60,
    backgroundColor: theme.palette.colors.zbayBlue,
    color: theme.palette.colors.white,
    '&:hover': {
      backgroundColor: theme.palette.colors.zbayBlue
    },
    '&:disabled': {
      backgroundColor: theme.palette.colors.darkGray,
      opacity: 0.7
    }
  },
  inProgress: {
    '&:disabled': {
      backgroundColor: theme.palette.colors.zbayBlue,
      opacity: 1
    }
  },
  progress: {
    color: theme.palette.colors.white
  }
})

interface LoadingButtonProps {
  inProgress: boolean
  text: string | undefined
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  inProgress = false,
  text,
  ...other
}) => {
  const classes = useStyles({})

  return (
    <MuiThemeProvider theme={theme}>
      inProgress ? (
      <Button
        className={classNames({ [classes.button]: true, [classes.inProgress]: true })}
        {...other}>
        <CircularProgress className={classes.progress} />
      </Button>
      ) : (
      <Button className={classes.button} {...other}>
        {text || 'Continue'}
      </Button>
      )
    </MuiThemeProvider>
  )
}

export default LoadingButton
