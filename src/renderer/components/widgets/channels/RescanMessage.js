import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'

import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    width: '100%',
    padding: '8px 16px'
  },
  item: {
    backgroundColor: theme.palette.colors.gray03,
    padding: '9px 16px'
  },
  info: {
    color: theme.palette.colors.trueBlack,
    letterSpacing: '0.4px'
  },
  rescanButton: {
    color: theme.palette.colors.lushSky,
    cursor: 'pointer'
  }
})

export const RescanMessage = ({ classes, onClick }) => {
  return (
    <Grid container className={classes.root}>
      <Grid item xs className={classes.item}>
        <Typography variant='caption' className={classes.info}>
          Showing only future messages.{' '}
          <span className={classes.rescanButton} onClick={onClick}>Restart Zbay</span> to see
          older messages.
        </Typography>
      </Grid>
    </Grid>
  )
}

RescanMessage.propTypes = {
  classes: PropTypes.object.isRequired,
  onClick: PropTypes.func
}

export default R.compose(React.memo, withStyles(styles))(RescanMessage)
