import React from 'react'
import * as R from 'ramda'
import * as Yup from 'yup'
import { Formik, Form } from 'formik'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import TextField from '../../ui/TextField/TextField'
import countryData from './countryData'

const useStyles = makeStyles((theme) => ({
  fullWidth: {
    width: '100%'
  },
  item: {
    marginTop: 19
  },
  submitButton: {},
  label: {
    fontSize: 12,
    color: theme.palette.colors.black30
  },
  button: {
    marginTop: 14,
    height: 60,
    width: 126,
    fontSize: '0.9rem',
    backgroundColor: theme.palette.colors.zbayBlue
  },
  title: {
    marginBottom: 14
  },
  spacing: {
    marginLeft: 16
  },
  info: {
    marginBottom: 8
  }
}))

export const formSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  street: Yup.string().required('Required'),
  country: Yup.string()
    .oneOf(R.keys(countryData))
    .required('Required'),
  region: Yup.string()
    .when('country', (country, schema) =>
      schema.oneOf(R.propOr([], country, countryData))
    )
    .required('Required'),
  city: Yup.string().required('Required'),
  postalCode: Yup.string().required('Required')
})

interface ShippingSettingsFormProps {
  initialValues: {
    firstName: string
    lastName: string
    street: string
    country: string
    region: string
    city: string
    postalCode: string
  }
  handleSubmit: () => void
}

export const ShippingSettingsForm: React.FC<ShippingSettingsFormProps> = ({
  initialValues = {
    firstName: '',
    lastName: '',
    street: '',
    country: '',
    region: '',
    city: '',
    postalCode: ''
  },
  handleSubmit
}) => {
  const classes = useStyles({})
  return (
    <Formik
      onSubmit={handleSubmit}
      validationSchema={formSchema}
      initialValues={initialValues}
    >
      {({ values, isSubmitting }) => (
        <Form className={classes.fullWidth}>
          <Grid container direction='column' alignItems='flex-start'>
            <Grid item className={classes.title}>
              <Typography variant='h3'>Shipping Address</Typography>
            </Grid>
            <Grid item className={classes.info}>
              <Typography variant='body2'>
                Your shipping address is saved on your computer, and sent in
                private to sellers only when you include it while making a
                purchase.{' '}
              </Typography>
            </Grid>

            <Grid item container direction='row' justify='space-between'>
              <Grid item xs>
                <Typography className={classes.label} variant='body2'>
                  First Name
                </Typography>
                <TextField
                  id='first-name'
                  name='firstName'
                  margin='none'
                  variant='outlined'
                  value={values.firstName}
                />
              </Grid>
              <Grid item xs className={classes.spacing}>
                <Typography className={classes.label} variant='body2'>
                  Last Name
                </Typography>
                <TextField
                  id='last-name'
                  name='lastName'
                  margin='none'
                  variant='outlined'
                  value={values.lastName}
                />
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction='row'
              justify='space-between'
              className={classes.item}
            >
              <Grid item xs={12}>
                <Typography className={classes.label} variant='body2'>
                  Country
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction='row'
              justify='space-between'
              className={classes.item}
            >
              <Grid item xs>
                <Typography className={classes.label} variant='body2'>
                  City
                </Typography>
                <TextField
                  id='city'
                  name='city'
                  margin='none'
                  variant='outlined'
                  value={values.city}
                />
              </Grid>
              <Grid item xs className={classes.spacing}>
                <Typography className={classes.label} variant='body2'>
                  Postal Code
                </Typography>
                <TextField
                  id='postal-code'
                  name='postalCode'
                  margin='none'
                  variant='outlined'
                  value={values.postalCode}
                />
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction='row'
              justify='space-between'
              className={classes.item}
            >
              <Grid item xs={12}>
                <Typography className={classes.label} variant='body2'>
                  Region
                </Typography>
              </Grid>
            </Grid>

            <Grid container item className={classes.item}>
              <Grid item xs={12}>
                <Typography className={classes.label} variant='body2'>
                  Street Address
                </Typography>
                <TextField
                  id='street-address'
                  name='street'
                  fullWidth
                  margin='none'
                  variant='outlined'
                  value={values.street}
                />
              </Grid>
            </Grid>
            <Grid container item>
              <Grid item xs={12} className={classes.submitButton}>
                <Button
                  variant='contained'
                  size='large'
                  color='primary'
                  type='submit'
                  fullWidth
                  disabled={isSubmitting}
                  className={classes.button}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  )
}

export default ShippingSettingsForm
