import React from 'react'

import Typography from '@material-ui/core/Typography'
import { Button } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import SettingsModal from '../../containers/widgets/settings/SettingsModal'
import ReceivedInvitationModal from '../../containers/ui/InvitationModal/ReceivedInvitationModal'
import CreateUsernameModal from '../../containers/widgets/createUsernameModal/CreateUsername'

import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles'

import theme from '../../theme'

const useStyles = makeStyles({
  root: {
    marginTop: theme.spacing(1),
    WebkitAppRegion: process.platform === 'win32' ? 'no-drag' : 'drag',
    paddingLeft: 16,
    paddingRight: 16
  },
  button: {
    color: theme.palette.colors.white,
    padding: 0,
    textAlign: 'left',
    opacity: 0.8,
    '&:hover': {
      opacity: 1,
      backgroundColor: 'inherit'
    }
  },
  buttonLabel: {
    justifyContent: 'flex-start',
    textTransform: 'none'
  },
  nickname: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: 175,
    whiteSpace: 'nowrap'
  }
})

interface IdentityPanelProps {
  user: User
  identity: Identity
  handleSettings: () => void
}

interface Identity {
  name: string
  address: string
  signerPubKey: string
}

interface User {
  nickname: string
}

export const IdentityPanel: React.FC<IdentityPanelProps> = ({ identity, handleSettings, user }) => {
  const classes = useStyles({})

  const nickname = user ? user.nickname : `anon${identity.signerPubKey.substring(0, 10)}`

  return (
    <MuiThemeProvider theme={theme}>
      <div className={classes.root}>
        <Button
          onClick={handleSettings}
          component='span'
          classes={{ root: classes.button, label: classes.buttonLabel }}>
          <Typography variant='h4' className={classes.nickname}>
            {nickname}
          </Typography>
          <ExpandMoreIcon fontSize='small' />
        </Button>
        <SettingsModal />
        <ReceivedInvitationModal />
        {/* <ImportChannelModal /> */}
        <CreateUsernameModal />
      </div>
    </MuiThemeProvider>
  )
}

export default IdentityPanel
