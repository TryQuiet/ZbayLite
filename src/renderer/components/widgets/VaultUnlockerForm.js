import React, { useState } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import { Redirect } from 'react-router'
// import BigNumber from 'bignumber.js'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

import PasswordField from '../ui/form/PasswordField'
import Icon from '../ui/Icon'
import LoadingButton from '../ui/LoadingButton'

import icon from '../../static/images/zcash/logo-lockup--circle.svg'
// import Tor from '../../containers/windows/Tor'
import electronStore from '../../../shared/electronStore'

const styles = theme => ({
  paper: {
    width: '100vw',
    height: '100vh',
    padding: 20,
    WebkitAppRegion: process.platform === 'win32' ? 'no-drag' : 'drag'
  },
  icon: {
    width: 285,
    height: 67
  },
  logoContainer: {
    height: 167,
    marginBottom: 40
  },
  passwordField: {
    width: 286
  },
  title: {
    textAlign: 'center',
    width: 456,
    fontSize: 14,
    color: theme.palette.colors.black30,
    lineHeight: '20px',
    height: 36,
    marginBottom: 16
  },
  torDiv: {
    marginTop: -8
  },
  status: {
    width: '100%',
    textAlign: 'center'
  },
  progressBar: {
    backgroundColor: theme.palette.colors.linkBlue
  },
  rootBar: {
    width: 250
  },
  moreOptionsButton: {
    color: theme.palette.colors.lushSky
  }
})

const formSchema = Yup.object().shape({
  password: Yup.string().required('Required')
})

export const VaultUnlockerForm = ({
  classes,
  locked,
  initialValues,
  onSubmit,
  nodeConnected,
  exists,
  isLogIn,
  latestBlock,
  currentBlock,
  isRescanning,
  loader,
  openModal
}) => {
  const isDev =
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'production'
  const vaultPassword = electronStore.get('vaultPassword')
  const [done, setDone] = useState(true)
  return (
    <Formik
      onSubmit={(values, actions) => {
        onSubmit(values, actions, setDone)
      }}
      validationSchema={vaultPassword || isDev ? null : formSchema}
      initialValues={initialValues}
    >
      {({ isSubmitting }) => (
        <Form>
          <Grid
            container
            direction='column'
            spacing={2}
            justfy='center'
            alignItems='center'
            alignContent='center'
          >
            <Grid
              className={classes.logoContainer}
              container
              item
              xs={12}
              justify='center'
              alignItems='center'
              alignContent='center'
            >
              <Icon className={classes.icon} src={icon} />
            </Grid>
            <Grid container item xs={12} wrap='wrap' justify='center'>
              <Typography
                className={classes.title}
                variant='body1'
                gutterBottom
              >
                {`We're building Zbay because we want a patch of online life that's controlled by the people of the Internet.`}
              </Typography>
            </Grid>
            {((!vaultPassword && !isDev) ||
              (isDev && exists && !vaultPassword)) && (
              <Grid container item justify='center'>
                <PasswordField
                  name='password'
                  className={classes.passwordField}
                  label='Enter Password'
                  fullWidth
                />
              </Grid>
            )}
            <Grid container item justify='center'>
              <LoadingButton
                type='submit'
                variant='contained'
                size='large'
                color='primary'
                margin='normal'
                text={' Connect now'}
                fullWidth
                inProgress={!done || isRescanning}
              />
            </Grid>
            <Grid container item justify='center'>
              <Typography
                variant='body'
                className={classes.moreOptionsButton}
                onClick={() => openModal()}
              >More options</Typography>
            </Grid>
            {(loader.loading || isRescanning) && (
              <Grid item container justify='center' alignItems='center'>
                <Typography variant='body2' className={classes.status}>
                  {isRescanning
                    ? `Syncing ${currentBlock.toString()} / ${latestBlock.toString()}`
                    : `${loader.message}`}
                </Typography>
              </Grid>
            )}
            {/* {locked && done && !isRescanning && (
              <Grid item className={classes.torDiv}>
                <Tor />
              </Grid>
            )} */}
          </Grid>
          {nodeConnected && isLogIn && !isRescanning && (
            <Redirect to='/main/channel/general' />
          )}
        </Form>
      )}
    </Formik>
  )
}
VaultUnlockerForm.propTypes = {
  classes: PropTypes.object.isRequired,
  isLogIn: PropTypes.bool.isRequired,
  locked: PropTypes.bool.isRequired,
  unlocking: PropTypes.bool.isRequired,
  exists: PropTypes.bool.isRequired,
  done: PropTypes.bool.isRequired,
  nodeConnected: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loader: PropTypes.object.isRequired,
  initialValue: PropTypes.shape({
    password: PropTypes.string.isRequired
  })
}
VaultUnlockerForm.defaultProps = {
  initialValues: {
    password: ''
  },
  unlocking: false,
  locked: true
}

export default withStyles(styles)(VaultUnlockerForm)
