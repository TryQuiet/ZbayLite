import React, { useState } from 'react'
import PropTypes from 'prop-types'
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik'
import * as R from 'ramda' // change to lodash
import classNames from 'classnames'
import config from '../../config'
import { io, Socket } from 'socket.io-client'
import { Socket as socketsActions } from '../const/actionsTypes'

import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'

import Modal from '../../ui/Modal'
import UsernameCreated from './UsernameCreated'
import electronStore from '../../../../shared/electronStore'
import { certificatesActions } from '../../store/certificates/certificates.reducer'

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

Yup.addMethod(Yup.mixed, 'validateUsername', function (certificateRegistrationError) {
  console.log('validating username')
  console.log(certificateRegistrationError)
  return this.test('test', 'Sorry username already taken. please choose another', value => {
    return !certificateRegistrationError
  })
})

// const getErrorsFromValidationError = validationError => {
//   const FIRST_ERROR = 0
//   return validationError.inner.reduce((errors, error) => {
//     return {
//       ...errors,
//       [error.path]: error.errors[FIRST_ERROR]
//     }
//   }, {})
// }

const sanitize = x => (x ? x.replace(/[^a-zA-Z0-9]+$/g, '').toLowerCase() : undefined)

// const validate = ({ nickname }, takenUsernames) => {
//   const sanitizedValue = sanitize(nickname)
//   const values = {
//     nickname: sanitizedValue
//   }
//   const validationSchema = getValidationSchema(values, takenUsernames)
//   try {
//     validationSchema.validateSync(values, { abortEarly: false })
//     return {}
//   } catch (error) {
//     return getErrorsFromValidationError(error)
//   }
// }

// const validateNew = ({nickname}) => {
//   console.log('Validate New')
//   const socket = io(config.socket.address)
//   const sanitizedValue = sanitize(nickname)
//   return new Promise(resolve => {
//     socket.once(socketsActions.CERTIFICATE_REGISTRATION_ERRORS, (payload, callback) => resolve(payload))
//     socket.once(certificatesActions, resolve(['some error that came with response']))
//     // socket.emit(certificatesActions.createOwnCertificate, {})
//   })
// }

// const validate = (values, certificateRegistrationError, certificate) => {

//   console.log('VALIDATING: ', certificateRegistrationError)
//   console.log('VALIDATING:  ', certificate)
//   return new Promise(resolve => {
//     if (certificateRegistrationError || certificate) {
//       if (certificateRegistrationError) {
//         resolve(certificateRegistrationError)
//       }
//     }
//   })
//   registrationResponseReady.then(() => {
//     console.log('asodhaksdhkjashdkhaskdh')
//   })
// }

const getValidationSchema = (values) => {
  console.log('VALIDATION SCHEMA')
  return Yup.object().shape({
    nickname: Yup.string()
      .min(3)
      .max(20)
      .matches(/^[a-zA-Z0-9]+$/, {
        message:
          'Your username cannot have any spaces or special characters, must be lowercase letters and numbers only',
        excludeEmptyString: true
      })
      // .validateUsername(certificateRegistrationError)
      .required('Required')
  })
}

const CustomInputComponent = ({
  classes,
  field,
  isTouched,
  form: { touched, errors, values },
  certificateRegistrationError,
  ...props
}) => {
  const { value, ...rest } = field
  const updatedValue = sanitize(value)
  const errors = errors.nickname || certificateRegistrationError
  return (
    <TextField
      variant={'outlined'}
      fullWidth
      className={classNames({
        [classes.focus]: true,
        [classes.margin]: true,
        [classes.error]: isTouched && errors
      })}
      placeholder={'Enter a username'}
      error={isTouched && errors}
      helperText={isTouched && errors}
      value={updatedValue}
      error={isTouched && errors }
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

export const CreateUsernameModal = ({
  classes,
  open,
  handleClose,
  initialValues,
  handleSubmit,
  certificateRegistrationError,
  certificate 
}) => {
  const [isTouched, setTouched] = useState(false)
  const [formSent, setFormSent] = useState(false)
  const responseReceived = Boolean(certificateRegistrationError || certificate)
  // if (responseReceived)
  console.log('responseReceived', responseReceived)
  console.log('formSent', formSent)
  if (certificate) {
    console.log('cerrrrt', certificate)
    electronStore.set('isNewUser', false)
  }
  const isNewUser = electronStore.get('isNewUser')
  return (
    <Modal open={open} handleClose={handleClose} isCloseDisabled={isNewUser}>
      <Grid container className={classes.main} direction='column'>
        {isNewUser ? (
          <React.Fragment>
            <Grid className={classes.title} item>
              <Typography variant={'h3'}>Register a username</Typography>
            </Grid>
            <Formik
              onSubmit={values => submitForm(handleSubmit, values, setFormSent)}
              initialValues={initialValues}
              validationSchema={values => getValidationSchema(values, certificateRegistrationError)}>
              {/* // validate={values => validate(values, certificateRegistrationError, certificate)}> */}
              {() => {
                return (
                  <Form className={classes.fullWidth}>
                    <Grid container className={classes.container}>
                      <Grid className={classes.field} item xs={12}>
                        <Typography variant='caption' className={classes.label}>
                          Choose your favorite username:{' '}
                        </Typography>
                        <Field
                          name='nickname'
                          classes={classes}
                          component={CustomInputComponent}
                          isTouched={isTouched}
                          certificateRegistrationError={certificateRegistrationError}
                        />
                      </Grid>
                      <Grid item xs={12} className={classes.infoDiv}>
                        <Typography variant='caption' className={classes.info}>
                          Your username cannot have any spaces or special characters, must be
                          lowercase letters and numbers only.
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      className={classes.buttonsContainer}
                      direction={'row'}
                      justify={'flex-start'}
                      spacing={2}>
                      <Grid item xs={'auto'} className={classes.buttonDiv}>
                        <Button
                          disabled={formSent && !responseReceived}
                          variant='contained'
                          size='small'
                          color='primary'
                          type='submit'
                          fullWidth
                          className={classes.button}
                          onClick={() => {
                            setTouched(true)
                          }}>
                          Continue
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )
              }}
            </Formik>
          </React.Fragment>
        ) : (
          <UsernameCreated handleClose={handleClose} setFormSent={setFormSent} />
        )}
      </Grid>
    </Modal>
  )
}

CreateUsernameModal.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  enoughMoney: PropTypes.bool.isRequired,
  usernameFee: PropTypes.number.isRequired,
  zecRate: PropTypes.object.isRequired,
  certificateRegistrationError: PropTypes.string.isRequired,
  certificate: PropTypes.object.isRequired
}

export default R.compose(React.memo, withStyles(styles))(CreateUsernameModal)
