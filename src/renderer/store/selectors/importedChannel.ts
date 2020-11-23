import { createSelector } from 'reselect'

import { ImportedChannelStore } from '../handlers/importedChannel'

const channel = (s): ImportedChannelStore => s.importedChannel as ImportedChannelStore

const data = createSelector(channel, c => c.data)
const decoding = createSelector(channel, c => c.decoding)
const errors = createSelector(channel, c => c.errors)

export default {
  data,
  decoding,
  errors
}
