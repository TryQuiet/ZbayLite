import { createSelector } from 'reselect'

import { WhitelistStore } from '../handlers/whitelist'

const whitelist = (s): WhitelistStore => s.whitelist as WhitelistStore

const whitelisted = createSelector(whitelist, a => a.whitelisted)
const allowAll = createSelector(whitelist, a => a.allowAll)
const autoload = createSelector(whitelist, a => a.autoload)

export default {
  whitelist,
  whitelisted,
  allowAll,
  autoload
}
