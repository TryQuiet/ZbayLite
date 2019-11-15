import React, { useState } from 'react'
import PropTypes from 'prop-types'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { FormControlLabel, Checkbox, TextField } from '@material-ui/core'

const styles = theme => ({
  container: {
    paddingLeft: 15,
    paddingRight: 15
  },
  addressField: {
    marginTop: 24
  },
  label: {
    fontSize: 12,
    color: theme.palette.colors.black30
  },
  checkboxLabel: {
    fontSize: 13
  },
  checkboxDiv: {
    marginTop: 24
  }
})

const checkAddress = (address, updateDonationAddress, setAddressStatus) => {
  const isValid = /^t1[a-zA-Z0-9]{33}$|^ztestsapling1[a-z0-9]{75}$|^zs1[a-z0-9]{75}$/.test(address)
  if (isValid) {
    updateDonationAddress(address)
    setAddressStatus(true)
  } else {
    setAddressStatus(false)
  }
}

export const DonationsSettingsForm = ({
  classes,
  updateDonation,
  donationAllow,
  initialValues,
  updateDonationAddress
}) => {
  const [isAddressValid, setAddressStatus] = useState(!!initialValues.donationAddress)
  return (
    <Grid container direction={'row'} className={classes.container}>
      <Grid xs={12} item>
        <Typography variant='h3'>Donations</Typography>
        <Grid item xs={12} className={classes.addressField}>
          <Typography variant='caption' className={classes.label}>
            Donation recipient
          </Typography>
          <TextField
            name='donationAddress'
            fullWidth
            variant='outlined'
            defaultValue={initialValues.donationAddress || ''}
            placeholder='Enter Zcash Address'
            helperText={isAddressValid || 'Please insert correct address'}
            error={!isAddressValid}
            onChange={e => checkAddress(e.target.value, updateDonationAddress, setAddressStatus)}
            InputProps={{ className: classes.field }}
          />
        </Grid>
      </Grid>
      <Grid xs={12} item className={classes.checkboxDiv}>
        <FormControlLabel
          control={
            <Checkbox
              checked={donationAllow === 'true'}
              onChange={e => {
                updateDonation(e.target.checked)
              }}
              color='primary'
            />
          }
          label={
            <Typography variant='body2' className={classes.checkboxLabel}>
              Allow for sending a small donation to Zbay team
            </Typography>
          }
        />
      </Grid>
    </Grid>
  )
}

DonationsSettingsForm.propTypes = {
  classes: PropTypes.object.isRequired,
  donationAllow: PropTypes.string,
  initialValues: PropTypes.object.isRequired,
  updateDonation: PropTypes.func.isRequired,
  updateDonationAddress: PropTypes.func.isRequired
}

export default withStyles(styles)(DonationsSettingsForm)
