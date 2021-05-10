import { produce, immerable } from 'immer'
import crypto from 'crypto'
import { createAction, handleActions } from 'redux-actions'

import directMessagesSelectors from '../selectors/directMessages'
import identitySelectors from '../selectors/identity'
import channelSelectors from '../selectors/channel'

import { actionTypes } from '../../../shared/static'
import { ActionsType, PayloadType } from './types'
import { directMessagesActions } from '../../sagas/directMessages/directMessages.reducer'

interface IUser {
  nickname: string
  publicKey: string
  halfKey: string
}

interface IConversation {
  sharedSecret: string
  contactPublicKey: string
  conversationId: string
}

export class DirectMessages {
  users: { [key: string]: IUser }
  conversations: { [key: string]: IConversation }
  conversationsList: { [key: string]: string }
  publicKey: string
  privateKey: string
  isAdded?: boolean
  constructor(values?: Partial<DirectMessages>) {
    Object.assign(this, values)
    this[immerable] = true
  }
}

export type DirectMessagesStore = DirectMessages

export const initialState: DirectMessagesStore = {
  users: {
    '02dc8264c555d46b3f6b16f1e751e979ebc69e6df6a02e7d4074a5df981e507da2': {
      nickname: 'holmes',
      publicKey: '02dc8264c555d46b3f6b16f1e751e979ebc69e6df6a02e7d4074a5df981e507da2',
      halfKey: '279e40e4ad5bc84f6cfcdb90465317e61255ba7ee78600179ea129a77e1bcef4'
    }
  },
  conversations: {},
  conversationsList: {},
  privateKey: '',
  publicKey: ''
}

const fetchUsers = createAction<{ usersList: { [key: string]: IUser } }>(actionTypes.FETCH_USERS)
const setPublicKey = createAction<string>(actionTypes.SET_PUBLIC_KEY)
const setPrivateKey = createAction<string>(actionTypes.SET_PRIVATE_KEY)
const addConversation = createAction<IConversation>(actionTypes.ADD_CONVERSATION)
const fetchConversations = createAction<{ conversationsList: { [key: string]: string } }>(
  actionTypes.FETCH_CONVERSATIONS
)

export const actions = {
  fetchUsers,
  setPublicKey,
  setPrivateKey,
  addConversation,
  fetchConversations
}

export type DirectMessagesActions = ActionsType<typeof actions>

const generateDiffieHellman = () => async dispatch => {
  const prime = 'b25dbea8c5f6c0feff269f88924a932639f8d8f937d19fa5874188258a63a373'
  const generator = '02'

  const dh = crypto.createDiffieHellman(prime, 'hex', generator, 'hex')
  dh.generateKeys()
  const privateKey = dh.getPrivateKey('hex')
  const publicKey = dh.getPublicKey('hex')

  await dispatch(actions.setPrivateKey(privateKey))
  await dispatch(actions.setPublicKey(publicKey))
}

export const getPrivateConversations = () => dispatch => {
  dispatch(directMessagesActions.getPrivateConversations())
}

const encodeMessage = (sharedSecret, message) => {
  const IVO = '5183666c72eec9e45183666c72eec9e4'
  const ENC_KEY = Buffer.from(sharedSecret.substring(0, 64), 'hex')
  const IV = Buffer.from(IVO, 'hex')

  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV)
  let encrypted = cipher.update(message, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

const decodeMessage = (sharedSecret, message) => {
  const IVO = '5183666c72eec9e45183666c72eec9e4'
  const ENC_KEY = Buffer.from(sharedSecret.substring(0, 64), 'hex')
  const IV = Buffer.from(IVO, 'hex')

  const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV)
  const decrypted = decipher.update(message, 'base64', 'utf8')
  return decrypted + decipher.final('utf8')
}

const checkConversation = (id, encryptedPhrase) => (_dispatch, getState) => {
  const privKey = directMessagesSelectors.privateKey(getState())
  const prime = 'b25dbea8c5f6c0feff269f88924a932639f8d8f937d19fa5874188258a63a373'
  const generator = '02'
  const dh = crypto.createDiffieHellman(prime, 'hex', generator, 'hex')
  dh.setPrivateKey(privKey, 'hex')
  const sharedSecret = dh.computeSecret(id, 'hex').toString('hex')
  const decodedMessage = decodeMessage(sharedSecret, encryptedPhrase)
  if (decodedMessage.startsWith('no panic')) {
    actions.addConversation({
      sharedSecret,
      contactPublicKey: decodedMessage.slice(8),
      conversationId: id
    })
  } else {
  }
}

const initializeConversation = () => async (dispatch, getState) => {
  const contactPublicKey = channelSelectors.channel(getState()).id

  const myPublicKey = identitySelectors.signerPubKey(getState())

  const halfKey = directMessagesSelectors.user(contactPublicKey)(getState()).halfKey

  const prime = 'b25dbea8c5f6c0feff269f88924a932639f8d8f937d19fa5874188258a63a373'
  const generator = '02'

  const dh = crypto.createDiffieHellman(prime, 'hex', generator, 'hex')
  dh.generateKeys()

  const pubKey = dh.getPublicKey('hex')

  const sharedSecret = dh.computeSecret(halfKey, 'hex').toString('hex')

  const encryptedPhrase = encodeMessage(sharedSecret, `no panic${myPublicKey}`)

  dispatch(
    actions.addConversation({
      sharedSecret,
      contactPublicKey: contactPublicKey,
      conversationId: pubKey
    })
  )

  await dispatch(
    directMessagesActions.initializeConversation({
      address: pubKey,
      encryptedPhrase
    })
  )
}

const getAvailableUsers = () => async dispatch => {
  await dispatch(directMessagesActions.getAvailableUsers())
}

export const epics = {
  generateDiffieHellman,
  getAvailableUsers,
  initializeConversation,
  getPrivateConversations,
  checkConversation,
  decodeMessage
}

export const reducer = handleActions<DirectMessagesStore, PayloadType<DirectMessagesActions>>(
  {
    [fetchUsers.toString()]: (
      state,
      { payload: { usersList } }: DirectMessagesActions['fetchUsers']
    ) =>
      produce(state, draft => {
        draft.users = {
          ...draft.users,
          ...usersList
        }
      }),
    [fetchConversations.toString()]: (
      state,
      { payload: { conversationsList } }: DirectMessagesActions['fetchConversations']
    ) =>
      produce(state, draft => {
        draft.conversationsList = {
          ...draft.conversationsList,
          ...conversationsList
        }
      }),
    [setPublicKey.toString()]: (
      state,
      { payload: publicKey }: DirectMessagesActions['setPublicKey']
    ) =>
      produce(state, draft => {
        draft.publicKey = publicKey
      }),
    [setPrivateKey.toString()]: (
      state,
      { payload: privateKey }: DirectMessagesActions['setPrivateKey']
    ) =>
      produce(state, draft => {
        draft.privateKey = privateKey
      }),
    [addConversation.toString()]: (
      state,
      { payload: conversation }: DirectMessagesActions['addConversation']
    ) =>
      produce(state, draft => {
        draft.conversations = {
          ...draft.conversations,
          [conversation.contactPublicKey]: conversation
        }
      })
  },
  initialState
)

export default {
  actions,
  epics,
  reducer
}
