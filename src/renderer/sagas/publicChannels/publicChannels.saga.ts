import { all as effectsAll, takeEvery } from 'redux-saga/effects'
import { put, select } from 'typed-redux-saga'
import { publicChannelsActions, PublicChannelsActions } from './publicChannels.reducer'
import { displayMessageNotification } from '../../notifications'
import { setPublicChannels } from '../../store/handlers/publicChannels'
import contactsHandlers, { actions } from '../../store/handlers/contacts'

import { findNewMessages } from '../../store/handlers/messages'

import usersSelectors from '../../store/selectors/users'
import contactsSelectors from '../../store/selectors/contacts'
import publicChannelsSelectors from '../../store/selectors/publicChannels'
import electronStore from '../../../shared/electronStore'
import debug from 'debug'

const log = Object.assign(debug('zbay:channels'), {
  error: debug('zbay:channels:err')
})

const all: any = effectsAll

export function* loadMessage(action: PublicChannelsActions['loadMessage']): Generator {
  const message = action.payload.message

  yield put(
    publicChannelsActions.addMessage({
      key: action.payload.channelAddress,
      message: { [message.id]: message }
    })
  )
}

export function* getPublicChannels(
  action: PublicChannelsActions['responseGetPublicChannels']
): Generator {
  if (action.payload) {
    yield put(setPublicChannels(action.payload))

    const mainChannel = yield* select(publicChannelsSelectors.publicChannelsByName('zbay'))
    if (mainChannel && !electronStore.get('generalChannelInitialized')) {
      yield put(
        contactsHandlers.actions.addContact({
          key: mainChannel.address,
          contactAddress: mainChannel.address,
          username: mainChannel.name
        })
      )
      yield put(publicChannelsActions.subscribeForTopic(mainChannel))
      electronStore.set('generalChannelInitialized', true)
    }
  }
}

export function* loadAllMessages(
  action: PublicChannelsActions['responseLoadAllMessages']
): Generator {
  const myUser = yield* select(usersSelectors.myUser)
  const pubChannels = yield* select(publicChannelsSelectors.publicChannels)

  const channel = yield* select(contactsSelectors.contact(action.payload.channelAddress))
  if (!channel) {
    log(`Couldn't load all messages. No channel ${action.payload.channelAddress} in contacts`)
    return
  }

  const { username } = channel
  if (!username) {
    return
  }
  const displayableMessages = action.payload.messages

  const messagesById = {}
  action.payload.messages.map(msg => {
    messagesById[msg.id] = msg
  })

  yield put(
    contactsHandlers.actions.setMessages({
      key: action.payload.channelAddress,
      username: username,
      contactAddress: action.payload.channelAddress,
      messages: messagesById
    })
  )

  const state = yield* select()
  const newMsgs = findNewMessages(action.payload.channelAddress, displayableMessages, state)
  const pubChannelsArray = Object.values(pubChannels)
  const contact = pubChannelsArray.filter(item => {
    return item.name === username
  })
  const msg = newMsgs[newMsgs.length - 1]
  if (msg && msg?.sender?.username !== myUser.nickname) {
    displayMessageNotification({
      senderName: msg.sender.username,
      message: msg.message,
      channelName: username,
      address: contact[0].address
    })
  }

  yield put(
    actions.appendNewMessages({
      contactAddress: action.payload.channelAddress,
      messagesIds: newMsgs
    })
  )
}

export function* sendIds(action: PublicChannelsActions['sendIds']): Generator {
  const channel = yield* select(contactsSelectors.contact(action.payload.channelAddress))
  if (!channel) {
    log(`Couldn't load all messages. No channel ${action.payload.channelAddress} in contacts`)
    return
  }
  console.log(action.payload.ids)
  let messagesToFetch = []
  const ids = Array.from(Object.values(channel.messages)).map(msg => msg.id)
  messagesToFetch = action.payload.ids.filter(id => !ids.includes(id))
  yield put(
    publicChannelsActions.askForMessages({
      channelAddress: action.payload.channelAddress,
      ids: messagesToFetch
    })
  )
}

export function* publicChannelsSaga(): Generator {
  yield all([
    takeEvery(`${publicChannelsActions.loadMessage}`, loadMessage),
    takeEvery(`${publicChannelsActions.responseLoadAllMessages}`, loadAllMessages),
    takeEvery(`${publicChannelsActions.responseGetPublicChannels}`, getPublicChannels),
    takeEvery(`${publicChannelsActions.sendIds}`, sendIds)
  ])
}
