import React from 'react'
import classNames from 'classnames'

import { makeStyles } from '@material-ui/core/styles'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Typography, Grid } from '@material-ui/core'
import { Contact } from '../../../store/handlers/contacts'
import { Channel } from '../../../store/handlers/channel'

const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0
  },
  selected: {
    backgroundColor: theme.palette.colors.lushSky,
    '&:hover': {
      backgroundColor: theme.palette.colors.lushSky
    }
  },
  badge: {
    padding: 6,
    top: '50%',
    right: theme.spacing(-3),
    fontSize: 10,
    background: 'rgb(0,0,0,0.3)',
    color: '#fff'
  },
  primary: {
    display: 'flex'
  },
  title: {
    opacity: 0.7,
    paddingLeft: 16,
    paddingRight: 16,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 215,
    whiteSpace: 'nowrap'
  },
  newMessages: {
    opacity: 1
  },
  icon: {
    marginTop: 6,
    fill: theme.palette.colors.green
  },
  itemText: {
    margin: 0
  },
  nameSpacing: {
    marginLeft: 4
  }
}))

interface OfferListItemProps {
  channel: Contact
  history: { push: (path: string) => () => void }
  selected: Channel
}

export const OfferListItem: React.FC<OfferListItemProps> = ({ channel, history, selected }) => {
  const classes = useStyles({})
  const channelObj = channel
  const highlight = channelObj.key === selected.id
  const newMessages = channelObj.newMessages.length
  return (
    <ListItem
      button
      disableGutters
      onClick={() => {
        history.push(`/main/offers/${channelObj.key}/${channelObj.address}`)
      }}
      className={classNames(classes.root, {
        [classes.selected]: highlight
      })}
    >
      <ListItemText
        primary={
          <Grid container alignItems='center'>
            <Grid item>
              <Typography
                variant='body2'
                className={classNames(classes.title, {
                  [classes.newMessages]: newMessages
                })}
              >
                {`# ${channelObj.username}`}
              </Typography>
            </Grid>
          </Grid>
        }
        classes={{
          primary: classes.primary
        }}
        className={classes.itemText}
      />
    </ListItem>
  )
}

export default OfferListItem
