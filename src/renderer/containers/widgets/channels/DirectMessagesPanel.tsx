import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import contactsSelectors from '../../../store/selectors/contacts'
import SidebarHeader from '../../../components/ui/Sidebar/SidebarHeader'
import QuickActionButton from '../../../components/widgets/sidebar/QuickActionButton'
import BaseChannelsList from '../../../components/widgets/channels/BaseChannelsList'
import channelSelectors from '../../../store/selectors/channel'

import { useModal } from '../../hooks'
import { ModalName } from '../../../sagas/modals/modals.types'

export const useDirectMessagesPanelData = () => {
  
  const data = {
  channels: useSelector(contactsSelectors.contactsList),
  selected: useSelector(channelSelectors.channelInfo),
}
return data
}

export const DirectMessagesPanel = (title
) => {

const modal = useModal(ModalName.newMessageSeparate)
const data = useDirectMessagesPanelData()
const {channels, selected} = useDirectMessagesPanelData()

  return (
    <Grid container item xs direction='column'>
      <Grid item>
        <SidebarHeader
          title={title}
          action={modal.handleOpen}
          tooltipText='Create new message'
        />
      </Grid>
      <Grid item>
        <BaseChannelsList
          channels={data.channels}
          selected={data.selected}
        />
      </Grid>
      <Grid item>
        <QuickActionButton
          text='New Message'
          action={modal.handleOpen}
        />
      </Grid>
    </Grid>
  )
}

export default DirectMessagesPanel