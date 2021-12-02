import { Grid, makeStyles, Typography } from '@material-ui/core'
import { DisplayableMessage } from '@zbayapp/nectar'
import React from 'react'

const useStyles = makeStyles(() => ({
  message: {
    marginTop: '-3px',
    fontSize: '0.855rem',
    whiteSpace: 'pre-line',
    lineHeight: '21px'
  },
  firstMessage: {
    paddingTop: 0
  },
  nextMessage: {
    paddingTop: 4
  }
}))

export interface NestedMessageContentProps {
  message: DisplayableMessage
  index: number
}

export const NestedMessageContent: React.FC<NestedMessageContentProps> = ({ message, index }) => {
  const classes = useStyles({})

  const outerDivStyle = index > 0 ? classes.nextMessage : classes.firstMessage

  return (
    <div key={message.id} className={outerDivStyle}>
      <Grid item>
        <Typography className={classes.message}>{message.message}</Typography>
      </Grid>
    </div>
  )
}

export default NestedMessageContent
