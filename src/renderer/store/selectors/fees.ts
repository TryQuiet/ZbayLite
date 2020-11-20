import { createSelector } from 'reselect'

import { FeesStore } from '../handlers/fees'

const fees = (s): FeesStore => s.fees as FeesStore

const userFee = createSelector(fees, a => a.user)
const publicChannelfee = createSelector(fees, a => a.publicChannel)

export default {
  userFee,
  publicChannelfee
}
