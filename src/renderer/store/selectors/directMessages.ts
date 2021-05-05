import { createSelector } from 'reselect'

import { Store } from '../reducers'

const directMessages = (s: Store) => s.directMessages

export const users = createSelector(directMessages, d => d.users)

export const user = (publicKey) => createSelector(users, d => d[publicKey])

export const publicKey = createSelector(directMessages, d => d.publicKey)
export const privateKey = createSelector(directMessages, d => d.privateKey)

export const conversations = createSelector(directMessages, d => d.conversations)

// export const conversationList = createSelector(directMessages, d => d.conversationList)

export default {
  users,
  user,
  publicKey,
  privateKey,
  conversations
}
