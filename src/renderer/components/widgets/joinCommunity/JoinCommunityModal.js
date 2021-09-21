import * as R from 'ramda' // change to lodash

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { Formik, Form, Field } from 'formik'
import classNames from 'classnames'

import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

import { withStyles } from '@material-ui/core/styles'

import Modal from '../../ui/Modal'
import { LoadingButton } from '../../ui/LoadingButton'

const styles = theme => ({
  root: {},
  focus: {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.colors.linkBlue
      }
    }
  },
  margin: {
    '& .MuiFormHelperText-contained': {
      margin: '5px 0px'
    }
  },
  error: {
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.colors.red
      }
    }
  },
  main: {
    backgroundColor: theme.palette.colors.white,
    padding: '0px 32px'
  },
  title: {
    marginTop: 24
  },
  fullWidth: {
    paddingBottom: 25
  },
  note: {
    fontSize: 14,
    lineHeight: '20px',
    color: theme.palette.colors.black30
  },
  field: {
    marginTop: 18
  },
  buttonDiv: {
    marginTop: 24
  },
  info: {
    lineHeight: '18px',
    color: theme.palette.colors.darkGray,
    letterSpacing: 0.4
  },
  button: {
    width: 139,
    height: 60,
    backgroundColor: theme.palette.colors.purple,
    padding: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.colors.darkPurple
    },
    '&:disabled': {
      backgroundColor: theme.palette.colors.lightGray,
      color: 'rgba(255,255,255,0.6)'
    }
  },
  closeModal: {
    backgroundColor: 'transparent',
    height: 60,
    fontSize: 16,
    lineHeight: '19px',
    color: theme.palette.colors.darkGray,
    '&:hover': {
      backgroundColor: 'transparent'
    }
  },
  buttonContainer: {
    marginBottom: 49
  },
  label: {
    fontSize: 12,
    color: theme.palette.colors.black30
  },
  link: {
    cursor: 'pointer',
    color: theme.palette.colors.linkBlue
  },
  spacing24: {
    marginTop: 24
  },
  infoDiv: {
    lineHeight: 'initial',
    marginTop: 8
  }
})

const CustomInputComponent = ({
  classes,
  field,
  isTouched,
  form: { touched, errors, values },
  joinCommunityError,
  ...props
}) => {
  const { value, ...rest } = field
  const errors = null
  return (
    <TextField
      variant={'outlined'}
      fullWidth
      className={classNames({
        [classes.focus]: true,
        [classes.margin]: true,
        [classes.error]: isTouched && nicknameErrors
      })}
      placeholder={'Community name'}
      error={isTouched && errors}
      helperText={isTouched && errors}
      defaultValue={values.nickname || ''}
      {...rest}
      {...props}
      onPaste={e => e.preventDefault()}
    />
  )
}

const submitForm = (handleSubmit, values, setFormSent) => {
  setFormSent(true)
  handleSubmit(values)
}

export const JoinCommunityModal = ({
  classes,
  open,
  handleClose,
  initialValues,
  handleSubmit,
  joinCommunityError
}) => {
  const [isTouched, setTouched] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const responseReceived = Boolean(joinCommunityError)
  const waitingForResponse = formSent && !responseReceived
  return (
    <Modal open={true} handleClose={handleClose}>
      <Grid container className={classes.main} direction='column'>
        <React.Fragment>
          <Grid className={classes.title} item>
            <Typography variant={'h3'}>Join community</Typography>
          </Grid>
          <Formik
            onSubmit={values => submitForm(handleSubmit, values, setFormSent)}
            initialValues={initialValues}>
            {() => {
              return (
                <Form className={classes.fullWidth}>
                  <Grid container className={classes.container}>
                    <Grid className={classes.field} item xs={12}>
                      <Typography variant='caption' className={classes.label}>
                        Paste your invite link to join an existing community.{' '}
                      </Typography>
                      <Field
                        name='communityAddress'
                        classes={classes}
                        component={CustomInputComponent}
                        isTouched={isTouched}
                        joinCommunityError={joinCommunityError}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    className={classes.buttonsContainer}
                    direction={'row'}
                    justify={'flex-start'}
                    spacing={2}>
                    <Grid item xs={'auto'} className={classes.buttonDiv}>
                      <LoadingButton
                        classes={classes}
                        type='submit'
                        variant='contained'
                        size='small'
                        color='primary'
                        margin='normal'
                        text={'Continue'}
                        fullWidth
                        disabled={waitingForResponse}
                        inProgress={waitingForResponse}
                        onClick={() => {
                          setTouched(true)
                        }}
                      />
                    </Grid>
                  </Grid>
                  <Grid
                    className={classNames({
                      [classes.spacing24]: true
                    })}>
                    <Typography variant='body2' className={classes.info}>
                      You can{' '}
                      <span className={classes.link} onClick={() => {}}>
                        create a new community
                      </span>
                      instead.
                    </Typography>
                  </Grid>
                </Form>
              )
            }}
          </Formik>
        </React.Fragment>
      </Grid>
    </Modal>
  )
}

JoinCommunityModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default R.compose(React.memo, withStyles(styles))(JoinCommunityModal)
