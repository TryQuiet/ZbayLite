import { createSelector } from 'reselect'

import { TorStore } from '../handlers/tor'

const tor = (s): TorStore => s.tor as TorStore

const torEnabled = createSelector(
  tor,
  tor => tor.enabled
)

export default {
  tor,
  torEnabled
}
