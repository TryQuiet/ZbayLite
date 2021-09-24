import React from 'react'

import { makeStyles } from '@material-ui/core/styles'
import iconHover from '../../../static/images/zcash/plus-icon.svg'
import icon from '../../../static/images/zcash/plus-icon-gray.svg'
import MenuAction from '../../ui/MenuAction'
import MenuActionItem from '../../ui/MenuActionItem'

const useStyles = makeStyles((theme) => ({
  button: {
    fontSize: 36,
    padding: 2,
    '&:hover': {
      backgroundColor: theme.palette.colors.white
    }
  },
  icon: {
    width: 24,
    height: 24
  }
}))

type ChannelInputActionProps = {
  onSendMoney: (...args: string[]) => void
  disabled: boolean
  targetRecipientAddress: string
}

export const ChannelInputAction: React.FC<ChannelInputActionProps> = ({
  onSendMoney,
  disabled,
  targetRecipientAddress
}) => {
  const classes = useStyles({})
  return (
    <MenuAction
      classes={{
        button: classes.button,
        icon: classes.icon
      }}
      icon={icon}
      iconHover={iconHover}
      offset='-10 12'
      disabled={disabled}
      placement='top-end'
    >

      {/* Disable post offer button until it works */}
      {/* {channelData && !channelData.offerId ? (
        <MenuActionItem onClick={onPostOffer} title='Post an offer' />
      ) : (
        <></>
      )} */}

      <MenuActionItem
        onClick={() => onSendMoney('sendMoneySeparate', targetRecipientAddress)}
        title='Send money'
      />
    </MenuAction>
  )
}

export default ChannelInputAction
