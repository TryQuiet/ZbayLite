import React from 'react'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom'

import ChannelMenuActionComponent from '../../../components/widgets/channels/ChannelMenuAction'
import { actionCreators } from '../../../store/handlers/modals'
import dmChannelSelectors from '../../../store/selectors/directMessageChannel'
// import importedChannelHandler from '../../../store/handlers/importedChannel'
import notificationCenterHandlers from '../../../store/handlers/notificationCenter'
import { notificationFilterType } from '../../../../shared/static'

export const mapStateToProps = state => ({
  targetAddress: dmChannelSelectors.targetRecipientAddress(state)
})

export const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      onInfo: actionCreators.openModal('channelInfo'),
      onMute: () =>
        notificationCenterHandlers.epics.setContactNotification(notificationFilterType.MUTE)
      // onDelete: () => importedChannelHandler.epics.removeChannel(history)
    },
    dispatch
  )
}
const ChannelMenuAction = ({ onDelete, targetAddress, ...props }) => {
  return <ChannelMenuActionComponent onDelete={onDelete}
    disableSettings={props.disableSettings}
    onInfo={props.onInfo}
    onMute={props.onMute}
    onSettings={props.onSettings}
    onUnmute={props.onUnmute}
    mutedFlag={props.mutedFlag}
    notificationFilter={props.notificationFilter}
    openNotificationsTab={props.openNotificationsTab}
  />
}
export default R.compose(
  withRouter,
  // @ts-expect-error
  connect(mapStateToProps, mapDispatchToProps)
  // @ts-expect-error
)(ChannelMenuAction)
