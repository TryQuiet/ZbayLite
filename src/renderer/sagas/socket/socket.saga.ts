import { io } from 'socket.io-client'
import crypto from 'crypto'
import * as R from 'ramda'
import {
  PublicChannelsActions,
  publicChannelsActions
} from '../publicChannels/publicChannels.reducer'
import {
  directMessagesActions,
  DirectMessagesActions
} from '../directMessages/directMessages.reducer'
import { eventChannel } from 'redux-saga'
import { transferToMessage } from '../publicChannels/publicChannels.saga'
import { fork } from 'redux-saga/effects'
import { call, take, select, put } from 'typed-redux-saga'
import { ActionFromMapping, Socket as socketsActions } from '../const/actionsTypes'
import channelSelectors from '../../store/selectors/channel'
import identitySelectors from '../../store/selectors/identity'
import directMessagesSelectors from '../../store/selectors/directMessages'
import usersSelectors from '../../store/selectors/users'
import { messages } from '../../zbay'
import config from '../../config'
import { messageType } from '../../../shared/static'
import { ipcRenderer } from 'electron'

export const connect = async () => {
  const socket = io(config.socket.address)
  return await new Promise(resolve => {
    socket.on('connect', async () => {
      ipcRenderer.send('connectionReady')
      resolve(socket)
    })
  })
}

export function subscribe(socket) {
  return eventChannel<ActionFromMapping<PublicChannelsActions & DirectMessagesActions>>(emit => {
    socket.on(socketsActions.MESSAGE, payload => {
      emit(publicChannelsActions.loadMessage(payload))
    })
    socket.on(socketsActions.RESPONSE_FETCH_ALL_MESSAGES, payload => {
      emit(publicChannelsActions.responseLoadAllMessages(payload))
    })
    socket.on(socketsActions.RESPONSE_GET_PUBLIC_CHANNELS, payload => {
      emit(publicChannelsActions.responseGetPublicChannels(payload))
    })
    // Direct messages
    socket.on(socketsActions.DIRECT_MESSAGE, payload => {
      emit(directMessagesActions.loadDirectMessage(payload))
    })
    socket.on(socketsActions.RESPONSE_FETCH_ALL_DIRECT_MESSAGES, payload => {
      emit(directMessagesActions.responseLoadAllDirectMessages(payload))
    })
    socket.on(socketsActions.RESPONSE_GET_AVAILABLE_USERS, payload => {
      emit(directMessagesActions.responseGetAvailableUsers(payload))
    })
    socket.on(socketsActions.RESPONSE_GET_PRIVATE_CONVERSATIONS, payload => {
      console.log('get answer from waggle')
      console.log(`payload is ${payload}`)
      emit(directMessagesActions.responseGetPrivateConversations(payload))
    })
    return () => {}
  })
}

export function* handleActions(socket): Generator {
  const socketChannel = yield* call(subscribe, socket)
  while (true) {
    const action = yield* take(socketChannel)
    yield put(action)
  }
}

export function* sendMessage(socket): Generator {
  while (true) {
    yield* take(`${publicChannelsActions.sendMessage}`)
    const { address } = yield* select(channelSelectors.channel)
    const messageToSend = yield* select(channelSelectors.message)
    const users = yield* select(usersSelectors.users)
    let message = null
    const privKey = yield* select(identitySelectors.signerPrivKey)
    message = messages.createMessage({
      messageData: {
        type: messageType.BASIC,
        data: messageToSend
      },
      privKey: privKey
    })
    const messageDigest = crypto.createHash('sha256')
    const messageEssentials = R.pick(['createdAt', 'message'])(message)
    const key = messageDigest.update(JSON.stringify(messageEssentials)).digest('hex')
    const preparedMessage = {
      ...message,
      id: key,
      typeIndicator: false,
      signature: message.signature.toString('base64')
    }
    const displayableMessage = transferToMessage(preparedMessage, users)
    yield put(
      publicChannelsActions.addMessage({
        key: address,
        message: { [preparedMessage.id]: displayableMessage }
      })
    )
    socket.emit(socketsActions.SEND_MESSAGE, { channelAddress: address, message: preparedMessage })
  }
}

export function* subscribeForTopic(socket): Generator {
  while (true) {
    const { payload } = yield* take(`${publicChannelsActions.subscribeForTopic}`)
    socket.emit(socketsActions.SUBSCRIBE_FOR_TOPIC, payload)
  }
}

export function* fetchAllMessages(socket): Generator {
  while (true) {
    const { payload } = yield* take(`${publicChannelsActions.loadAllMessages}`)
    socket.emit(socketsActions.FETCH_ALL_MESSAGES, payload)
  }
}

export function* getPublicChannels(socket): Generator {
  while (true) {
    yield* take(`${publicChannelsActions.getPublicChannels}`)
    socket.emit(socketsActions.GET_PUBLIC_CHANNELS)
  }
}

// Direct Messages

export function* subscribeForDirectMessageThread(socket): Generator {
  while (true) {
    const { payload } = yield* take(`${directMessagesActions.subscribeForDirectMessageThread}`)
    socket.emit(socketsActions.SUBSCRIBE_FOR_DIRECT_MESSAGE_THREAD, payload)
  }
}

export function* getAvailableUsers(socket): Generator {
  while (true) {
    yield* take(`${directMessagesActions.getAvailableUsers}`)
    console.log('get available users in socket saga')
    socket.emit(socketsActions.GET_AVAILABLE_USERS)
  }
}

export function* addUser(socket): Generator {
  while (true) {
    const { payload } = yield* take(`${directMessagesActions.addUser}`)
    console.log(`paylaod address is ${payload.address}`)
    console.log(`paylaod diffiehellman is ${payload.halfKey}`)
    socket.emit(socketsActions.ADD_USER, payload)
  }
}

export function* initializeConversation(socket): Generator {
  while (true) {
    const { payload } = yield* take(`${directMessagesActions.initializeConversation}`)
    console.log('initialize converstion soscket saga')
    console.log(
    `in initializeCOnversation saga it is ${payload.address}`
    )
    console.log(
      `in initializeCOnversation saga it is ${payload.encryptedPhrase}`
      )
    socket.emit(socketsActions.INITIALIZE_CONVERSATION, payload)
  }
}

export function* getPrivateConversations(socket): Generator {
  while (true) {
    yield* take(`${directMessagesActions.getPrivateConversations}`)
    console.log('get private conversations in socket sagas')
    socket.emit(socketsActions.GET_PRIVATE_CONVERSATIONS)
  }
}

export function* sendDirectMessage(socket): Generator {
  while (true) {
    yield* take(`${directMessagesActions.sendDirectMessage}`)
    const { id } = yield* select(channelSelectors.channel)
    const conversations = yield* select(directMessagesSelectors.conversations)
    const conversationId = conversations[id].conversationId

    const messageToSend = yield* select(channelSelectors.message)
    const users = yield* select(usersSelectors.users)
    let message = null
    const privKey = yield* select(identitySelectors.signerPrivKey)
    message = messages.createMessage({
      messageData: {
        type: messageType.BASIC,
        data: messageToSend
      },
      privKey: privKey
    })
    const messageDigest = crypto.createHash('sha256')
    const messageEssentials = R.pick(['createdAt', 'message'])(message)
    const key = messageDigest.update(JSON.stringify(messageEssentials)).digest('hex')
    const preparedMessage = {
      ...message,
      id: key,
      typeIndicator: false,
      signature: message.signature.toString('base64')
    }
    const displayableMessage = transferToMessage(preparedMessage, users)
    yield put(
      directMessagesActions.addMessage({
        key: id,
        message: { [preparedMessage.id]: displayableMessage }
      })
    )
    console.log(`ZBAYLITE SOCKET SAGA: id is ${id}`)
    console.log(`ZBAYLITE SOCKET SAGA: prepared message is ${preparedMessage}`)
    socket.emit(socketsActions.SEND_DIRECT_MESSAGE, { channelAddress: conversationId, message: preparedMessage })
  }
}

export function* useIO(socket): Generator {
  yield fork(handleActions, socket)
  yield fork(sendMessage, socket)
  yield fork(fetchAllMessages, socket)
  yield fork(subscribeForTopic, socket)
  yield fork(getPublicChannels, socket)
  // Direct Messages
  yield fork(addUser, socket)
  yield fork(getAvailableUsers, socket)
  yield fork(initializeConversation, socket)
  yield fork(sendDirectMessage, socket)
  yield fork(getPrivateConversations, socket)
}

export function* startConnection(): Generator {
  while (true) {
    yield take(socketsActions.CONNECT_TO_WEBSOCKET_SERVER)
    const socket = yield call(connect)
    yield fork(useIO, socket)
  }
}
