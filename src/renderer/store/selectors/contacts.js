import { createSelector } from 'reselect'
import Immutable from 'immutable'
import identitySelectors from './identity'
import directMssagesQueueSelectors from './directMessagesQueue'
import operationsSelectors from './operations'
import { operationTypes } from '../handlers/operations'
import usersSelectors from './users'
import { mergeIntoOne, displayableMessageLimit } from './channel'

export const Contact = Immutable.Record({
  lastSeen: null,
  key: '',
  username: '',
  address: '',
  messages: Immutable.Map(),
  newMessages: Immutable.List(),
  vaultMessages: Immutable.List(),
  offerId: null
})

const store = s => s

const contacts = createSelector(store, state => state.get('contacts'))
const contactsList = createSelector(
  contacts,
  identitySelectors.removedChannels,
  (contacts, removedChannels) => {
    if (removedChannels.size > 0) {
      return contacts
        .filter(
          c =>
            c.key.length === 66 &&
            c.offerId === null &&
            !removedChannels.includes(c.address)
        )
        .toList()
    }
    return contacts
      .filter(c => c.key.length === 66 && c.offerId === null)
      .toList()
  }
)

const offerList = createSelector(
  contacts,
  identitySelectors.removedChannels,
  (contacts, removedChannels) => {
    if (removedChannels.size > 0) {
      return contacts
        .filter(c => !!c.offerId && !removedChannels.includes(c.key))
        .toList()
    }
    return contacts.filter(c => !!c.offerId).toList()
  }
)
const channelsList = createSelector(
  contacts,
  identitySelectors.removedChannels,
  (contacts, removedChannels) => {
    if (removedChannels.size > 0) {
      return contacts
        .filter(
          c =>
            c.key.length === 78 &&
            c.offerId === null &&
            !removedChannels.includes(c.address)
        )
        .toList()
    }
    return contacts
      .filter(c => c.key.length === 78 && c.offerId === null)
      .toList()
  }
)

const directMessagesContact = address =>
  createSelector(contacts, c =>
    c.toList().find(el => el.get('address') === address)
  )

const contact = address =>
  createSelector(contacts, c => c.get(address, Contact()))
const messagesSorted = address =>
  createSelector(contact(address), c => {
    return c.messages
      .toList()
      .sort((msg1, msg2) => msg2.createdAt - msg1.createdAt)
  })
const messagesLength = address =>
  createSelector(contact(address), c => {
    return c.messages.toList().size
  })
const messages = address =>
  createSelector(
    messagesSorted(address),
    displayableMessageLimit,
    (msgs, limit) => {
      return msgs.slice(0, limit)
    }
  )

const allMessages = createSelector(contacts, c =>
  c.reduce((acc, t) => acc.merge(t.messages), Immutable.Map())
)
const getAdvertById = txid =>
  createSelector(allMessages, msgs => msgs.get(txid))
const lastSeen = address => createSelector(contact(address), c => c.lastSeen)
const username = address => createSelector(contact(address), c => c.username)
const vaultMessages = address =>
  createSelector(contact(address), c => c.vaultMessages)
const newMessages = address =>
  createSelector(contact(address), c => c.newMessages)

export const queuedMessages = address =>
  createSelector(
    directMssagesQueueSelectors.queue,
    queue =>
      queue.filter(
        m => m.recipientAddress === address && m.message.get('type') < 10
      ) //  separate offer messages and direct messages
  )

export const pendingMessages = address =>
  createSelector(operationsSelectors.operations, operations =>
    operations.filter(
      o =>
        o.type === operationTypes.pendingDirectMessage &&
        o.meta.recipientAddress === address &&
        o.meta.message.get('type') < 10 //  separate offer messages and direct messages
    )
  )

export const directMessages = (address, signerPubKey) =>
  createSelector(
    identitySelectors.data,
    usersSelectors.registeredUser(signerPubKey),
    messages(address),
    (identity, registeredUser, messages) => {
      // const userData = registeredUser ? registeredUser.toJS() : null
      // const identityAddress = identity.address
      // const identityName = userData ? userData.nickname : identity.name

      // const fetchedMessagesToDisplay = messages.map(msg =>
      //   zbayMessages.receivedToDisplayableMessage({
      //     message: msg,
      //     identityAddress,
      //     receiver: { replyTo: identityAddress, username: identityName }
      //   })
      // )

      const merged = mergeIntoOne(messages)
      return merged
    }
  )

export default {
  contacts,
  directMessagesContact,
  queuedMessages,
  pendingMessages,
  contact,
  messages,
  directMessages,
  lastSeen,
  vaultMessages,
  username,
  newMessages,
  contactsList,
  channelsList,
  offerList,
  getAdvertById,
  allMessages,
  messagesLength
}
