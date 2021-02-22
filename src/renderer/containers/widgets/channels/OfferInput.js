import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import ChannelInputComponent from '../../../components/widgets/channels/ChannelInput'
import channelHandlers from '../../../store/handlers/channel'
import offersHandlers from '../../../store/handlers/offers'
import channelSelectors from '../../../store/selectors/channel'
import { MESSAGE_ITEM_SIZE } from '../../../zbay/transit'
import usersSelectors from '../../../store/selectors/users'
import contactsSelectors from '../../../store/selectors/contacts'
import directMessagesQueueHandlers from '../../../store/handlers/directMessagesQueue'

export const mapStateToProps = (state, { offer }) => {
  return {
    message: channelSelectors.message(state),
    id: channelSelectors.id(state),
    inputState: channelSelectors.inputLocked(state),
    offerName: contactsSelectors.contact(offer)(state).username,
    users: usersSelectors.users(state),
    myUser: usersSelectors.myUser(state)
  }
}

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      onChange: channelHandlers.actions.setMessage,
      sendItemMessageOnEnter: offersHandlers.epics.sendItemMessageOnEnter,
      resetDebounce:
        directMessagesQueueHandlers.epics.resetDebounceDirectMessage
    },
    dispatch
  )
}
export const ChannelInput = ({
  onChange,
  sendItemMessageOnEnter,
  message,
  inputState,
  offerName,
  users,
  myUser,
  resetDebounce,
  id
}) => {
  const [infoClass, setInfoClass] = React.useState(null)
  const [anchorEl, setAnchorEl] = React.useState({})
  const [mentionsToSelect, setMentionsToSelect] = React.useState([])
  const nameSplit = offerName.split('@')
  const inputPlaceholder = `@${nameSplit[nameSplit.length - 1]} as @${
    myUser.nickname
  }`
  return (
    <ChannelInputComponent
      infoClass={infoClass}
      id={id}
      setInfoClass={setInfoClass}
      onChange={e => {
        onChange({ value: e, id })
        resetDebounce()
      }}
      onKeyPress={sendItemMessageOnEnter}
      message={message}
      inputState={inputState}
      inputPlaceholder={inputPlaceholder}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      mentionsToSelect={mentionsToSelect}
      setMentionsToSelect={setMentionsToSelect}
      messageLimit={MESSAGE_ITEM_SIZE}
      users={users}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ChannelInput)
