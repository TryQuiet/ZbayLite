import React from 'react'
import Popover from '@material-ui/core/Popover'
import Jdenticon from 'react-jdenticon'
import { ISendMessagePopoverProps } from './SendMessagePopover.d'
import QuickActionLayout from '../../ui/QuickActionLayout'

export const SendMessagePopover: React.FC<ISendMessagePopoverProps> = ({
  username,
  address,
  anchorEl,
  handleClose,
  isUnregistered,
  createNewContact,
  history,
  users,
  waggleUsers
}) => {
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const registeredUsername = Array.from(Object.values(users)).filter(
    (obj) => obj.address === address
  )[0]
  let waggleIdentity = false
  if (waggleUsers) {
    const arr = Array.from(Object.keys(waggleUsers))
    if (registeredUsername) {
      if (arr.includes(registeredUsername.publicKey)) {
        waggleIdentity = true
      }
    }
  }
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <QuickActionLayout
        main={username}
        buttonName="Send message"
        handleClose={handleClose}
        warrning={
          !waggleIdentity ? 'Unregistered users cannot receive messages.' : null
        }
        onClick={() => {
          createNewContact({
            contact: {
              address,
              nickname: username,
              publicKey: registeredUsername
                ? registeredUsername.publicKey
                : null
            },
            history
          })
        }}
      >
        <Jdenticon size="100" value={username} />
      </QuickActionLayout>
    </Popover>
  )
}

export default SendMessagePopover
