import { createSelector } from 'reselect'

import { DirectMessageChannelStore } from '../handlers/directMessageChannel'

const directMessageChannel= (s): DirectMessageChannelStore => s.directMessageChannel as DirectMessageChannelStore

export const targetRecipientAddress = createSelector(directMessageChannel, d => d.targetRecipientAddress)

export default {
  directMessageChannel,
  targetRecipientAddress
}
