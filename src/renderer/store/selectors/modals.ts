import { createSelector } from 'reselect'

import { ModalsStore } from '../handlers/modals'

const modals = (s): ModalsStore => s.modals as ModalsStore

const open = name => createSelector(modals, m => m[name] || false)

const payload = name => createSelector(modals, m => m.payloads[name])

export default {
  modals,
  open,
  payload
}
