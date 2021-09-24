import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import dotsIcon from '../../../static/images/zcash/dots-icon.svg'
import IconButton from '../../ui/IconButton'
import MenuAction from '../../ui/MenuAction'
import MenuActionItem from '../../ui/MenuActionItem'
import ConfirmModal from '../channelSettings/ConfirmModal'

const useStyles = makeStyles((theme) => ({
  menuList: {
    padding: `${theme.spacing(1.5)}px 0`
  },
  icon: {
    width: 30,
    height: 30
  },
  sublabel: {
    color: theme.palette.colors.darkGray,
    letterSpacing: 0.4,
    fontSize: 12,
    lineHeight: '18px'
  }
}))

type ChannelMenuActionProps = {
  onInfo: React.MouseEventHandler<HTMLLIElement>
  onMute: React.MouseEventHandler<HTMLLIElement>
  onUnmute: React.MouseEventHandler<HTMLLIElement>
  onDelete: () => void
  onSettings: () => void
  mutedFlag: boolean
  disableSettings: boolean
  notificationFilter: string
  openNotificationsTab: () => void
}

export const ChannelMenuAction: React.FC<ChannelMenuActionProps> = ({
  onInfo,
  onMute,
  onUnmute,
  onDelete,
  onSettings,
  mutedFlag,
  disableSettings,
  notificationFilter,
  openNotificationsTab
}) => {
  const [openDialog, setOpenDialog] = React.useState(false)
  const classes = useStyles({})
  return (
    <MenuAction
      icon={dotsIcon}
      iconHover={dotsIcon}
      IconButton={IconButton}
      offset='0 8'
    >
      <MenuActionItem onClick={onInfo} title='Info & Invites' />

      <MenuActionItem
        onClick={e => {
          e.preventDefault()
          setOpenDialog(true)
        }}
        closeAfterAction={false}
        title='Remove'
      />

      {!disableSettings ? (
        <MenuActionItem onClick={onSettings} title='Settings' />
      ) : (
        <span />
      )}
      {!disableSettings ? (
        <MenuActionItem
          onClick={() => {
            openNotificationsTab()
            onSettings()
          }}
          title={
            <Grid container direction='column'>
              <Grid item>Notifications</Grid>
              <Grid item className={classes.sublabel}>
                {notificationFilter}
              </Grid>
            </Grid>
          }
        />
      ) : (
        <span />
      )}
      <MenuActionItem
        onClick={mutedFlag ? onUnmute : onMute}
        title={mutedFlag ? 'Unmute' : 'Mute'}
      />
      <ConfirmModal
        open={openDialog}
        title={'Are you sure you want to remove this channel?'}
        actionName='Yes'
        cancelName='No'
        handleClose={() => setOpenDialog(false)}
        handleAction={onDelete}
      />
    </MenuAction>
  )
}

export default ChannelMenuAction
