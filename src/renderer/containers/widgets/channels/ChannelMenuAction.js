import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as R from 'ramda'
import { withRouter } from 'react-router-dom'
import ChannelMenuAction from '../../../components/widgets/channels/ChannelMenuAction'
import { actionCreators } from '../../../store/handlers/modals'
import importedChannelHandler from '../../../store/handlers/importedChannel'
import dmChannelSelectors from '../../../store/selectors/directMessageChannel'
import channelSelectors from '../../../store/selectors/channel'
import notificationCenterSelectors from '../../../store/selectors/notificationCenter'
import publicChannelsSelectors from '../../../store/selectors/publicChannels'
import notificationCenterHandlers from '../../../store/handlers/notificationCenter'
import { notificationFilterType } from '../../../../shared/static'
import appHandlers from '../../../store/handlers/app'

const filterToText = {
  [notificationFilterType.ALL_MESSAGES]: 'Every new message',
  [notificationFilterType.MENTIONS]: 'Just @mentions',
  [notificationFilterType.NONE]: 'Nothing',
  [notificationFilterType.MUTE]: 'Muted'
}
export const mapStateToProps = state => {
  return {
    targetAddress: dmChannelSelectors.targetRecipientAddress(state),
    isOwner: channelSelectors.isOwner(state),
    publicChannels: publicChannelsSelectors.publicChannels(state),
    channel: channelSelectors.data(state) || {},
    mutedFlag:
      notificationCenterSelectors.channelFilterById(
        channelSelectors.data(state)
          ? channelSelectors.data(state).address
          : 'none'
      )(state) === notificationFilterType.MUTE,
    notificationFilter:
      // eslint-disable-next-line
      filterToText[
        notificationCenterSelectors.channelFilterById(
          channelSelectors.channel(state)
            ? channelSelectors.channel(state).address
            : 'none'
        )(state)
      ]
  }
}

export const mapDispatchToProps = (dispatch, { history }) => {
  return bindActionCreators(
    {
      onInfo: actionCreators.openModal('channelInfo'),
      onMute: () =>
        notificationCenterHandlers.epics.setChannelsNotification(
          notificationFilterType.MUTE
        ),
      onUnmute: () =>
        notificationCenterHandlers.epics.setChannelsNotification(
          notificationFilterType.ALL_MESSAGES
        ),
      onDelete: () => importedChannelHandler.epics.removeChannel(history),
      publishChannel: actionCreators.openModal('publishChannel'),
      onSettings: actionCreators.openModal('channelSettingsModal'),
      openNotificationsTab: () =>
        appHandlers.actions.setModalTab('notifications')
    },
    dispatch
  )
}

export default R.compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps)
)(ChannelMenuAction)
