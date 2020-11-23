import { createSelector } from 'reselect'

import { InvitationStore } from '../handlers/invitation'

const invitation = (s): InvitationStore => s.invitation as InvitationStore

const amount = createSelector(invitation, state => state.amount)
const amountZec = createSelector(invitation, state => state.amountZec)
const affiliateCode = createSelector(invitation, state => state.affiliateCode)
const generatedInvitation = createSelector(invitation, state => state.generatedInvitation)

export default {
  invitation,
  amount,
  affiliateCode,
  generatedInvitation,
  amountZec
}
