import { createSelector } from 'reselect'

import { VaultStore } from '../handlers/vault'

const vault = (s): VaultStore => s.vault as VaultStore

const exists = createSelector(vault, v => v.exists)
const isLogIn = createSelector(vault, v => v.isLogIn)
const creating = createSelector(vault, v => v.creating)
const locked = createSelector(vault, v => v.locked)
const unlocking = createSelector(vault, v => v.unlocking)
const error = createSelector(vault, v => v.error)

export default {
  exists,
  creating,
  unlocking,
  error,
  locked,
  isLogIn
}
