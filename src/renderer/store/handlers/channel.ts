import { produce, immerable } from 'immer'
import BigNumber from 'bignumber.js'
import { createAction, handleActions } from 'redux-actions'
import { remote } from 'electron'
import { DateTime } from 'luxon'

import history from '../../../shared/history'
import contactsSelectors from '../selectors/contacts'

import { actionTypes } from '../../../shared/static'
import contactsHandlers from './contacts'
import electronStore from '../../../shared/electronStore'

import { ActionsType, PayloadType } from './types'
// import { publicChannelsActions } from '../../sagas/publicChannels/publicChannels.reducer'xs
import { publicChannels } from '@zbayapp/nectar'

// TODO: to remove, but must be replaced in all the tests
export const ChannelState = {
  spentFilterValue: new BigNumber(0),
  id: null,
  message: {},
  shareableUri: '',
  address: '',
  loader: {
    loading: false,
    message: ''
  },
  members: null,
  showInfoMsg: true,
  isSizeCheckingInProgress: false,
  messageSizeStatus: null,
  displayableMessageLimit: 50
}
interface ILoader {
  loading: boolean
  message?: string
}

// TODO: find type of message and members
export class Channel {
  spentFilterValue?: BigNumber
  id?: string
  message?: object
  shareableUri?: string
  address?: string
  loader?: ILoader
  members?: object
  showInfoMsg?: boolean
  isSizeCheckingInProgress?: boolean
  messageSizeStatus?: boolean
  displayableMessageLimit: number = 50
  name?: string
  description?: string
  constructor(values?: Partial<Channel>) {
    Object.assign(this, values)
    this[immerable] = true
  }
}

export const initialState: Channel = new Channel({
  spentFilterValue: new BigNumber(0),
  message: {},
  shareableUri: '',
  address: '',
  loader: { loading: false, message: '' },
  members: {},
  showInfoMsg: true,
  isSizeCheckingInProgress: false,
  displayableMessageLimit: 50
})

const setLoading = createAction<boolean>(actionTypes.SET_CHANNEL_LOADING)
const setSpentFilterValue = createAction(actionTypes.SET_SPENT_FILTER_VALUE, (_, value) => value)
const setMessage = createAction<{ value: string; id: string }>(actionTypes.SET_CHANNEL_MESSAGE)
const setChannelId = createAction<string>(actionTypes.SET_CHANNEL_ID)
const isSizeCheckingInProgress = createAction<boolean>(actionTypes.IS_SIZE_CHECKING_IN_PROGRESS)
const messageSizeStatus = createAction<boolean>(actionTypes.MESSAGE_SIZE_STATUS)
const setShareableUri = createAction<string>(actionTypes.SET_CHANNEL_SHAREABLE_URI)
const setDisplayableLimit = createAction<number>(actionTypes.SET_DISPLAYABLE_LIMIT)
const setAddress = createAction<string>(actionTypes.SET_CHANNEL_ADDRESS)
const resetChannel = createAction(actionTypes.SET_CHANNEL)

export const actions = {
  setLoading,
  setSpentFilterValue,
  setMessage,
  setShareableUri,
  setChannelId,
  resetChannel,
  isSizeCheckingInProgress,
  setAddress,
  messageSizeStatus,
  setDisplayableLimit
}

export type ChannelActions = ActionsType<typeof actions>

const loadChannel = key => async (dispatch, getState) => {
  console.log('loadChannel', key)
  try {
    dispatch(publicChannels.actions.setCurrentChannel(key))
    dispatch(setChannelId(key))
    dispatch(setDisplayableLimit(30))
    const contact = contactsSelectors.contact(key)(getState())
    const unread = contact.newMessages.length
    remote.app.setBadgeCount(remote.app.getBadgeCount() - unread)
    electronStore.set(`lastSeen.${key}`, `${Math.floor(DateTime.utc().toSeconds())}`)
    dispatch(setAddress(contact.address))
    dispatch(contactsHandlers.actions.cleanNewMessages({ contactAddress: contact.key }))
    dispatch(contactsHandlers.actions.cleanNewMessages({ contactAddress: key }))
  } catch (err) {
    console.log(err)
  }
}
const linkChannelRedirect = targetChannel => async (dispatch, _getState) => {
  // const contact = contactsSelectors.contact(targetChannel.address)(getState())
  // if (targetChannel.name === 'zbay') {
  //   history.push('/main/channel/zs10zkaj29rcev9qd5xeuzck4ly5q64kzf6m6h9nfajwcvm8m2vnjmvtqgr0mzfjywswwkwke68t00')
  //   return
  // }
  // if (contact.address) {
  //   history.push(`/main/channel/${targetChannel.address}`)
  //   return
  // }

  dispatch(publicChannels.actions.setCurrentChannel(targetChannel.address))
  // await dispatch(
  //   contactsHandlers.actions.addContact({
  //     key: targetChannel.address,
  //     contactAddress: targetChannel.address,
  //     username: targetChannel.name
  //   })
  // )

  history.push(`/main/channel/${targetChannel.address}`)
}

const clearNewMessages = () => async (_dispatch, _getState) => {

}

// TODO: we should have a global loader map
export const reducer = handleActions<Channel, PayloadType<ChannelActions>>(
  {
    [setLoading.toString()]: (state, { payload: loading }: ChannelActions['setLoading']) =>
      produce(state, draft => {
        draft.loader.loading = loading
      }),
    [setSpentFilterValue.toString()]: (
      state,
      { payload: value }: ChannelActions['setSpentFilterValue']
    ) =>
      produce(state, draft => {
        draft.spentFilterValue = new BigNumber(value)
      }),
    [setMessage.toString()]: (state, { payload: { value, id } }: ChannelActions['setMessage']) =>
      produce(state, draft => {
        draft.message[id] = value
      }),
    [setChannelId.toString()]: (state, { payload: id }: ChannelActions['setChannelId']) =>
      produce(state, draft => {
        draft.id = id
      }),
    [isSizeCheckingInProgress.toString()]: (
      state,
      { payload }: ChannelActions['isSizeCheckingInProgress']
    ) =>
      produce(state, draft => {
        draft.isSizeCheckingInProgress = payload
      }),
    [messageSizeStatus.toString()]: (state, { payload }: ChannelActions['messageSizeStatus']) =>
      produce(state, draft => {
        draft.messageSizeStatus = payload
      }),
    [setShareableUri.toString()]: (state, { payload: uri }: ChannelActions['setShareableUri']) =>
      produce(state, draft => {
        draft.shareableUri = uri
      }),
    [setDisplayableLimit.toString()]: (
      state,
      { payload: limit }: ChannelActions['setDisplayableLimit']
    ) =>
      produce(state, draft => {
        draft.displayableMessageLimit = limit
      }),
    [setAddress.toString()]: (state, { payload: address }: ChannelActions['setAddress']) =>
      produce(state, draft => {
        draft.address = address
      }),
    [resetChannel.toString()]: () => initialState
  },
  initialState
)

export const epics = {
  loadChannel,
  clearNewMessages,
  linkChannelRedirect
}

export default {
  reducer,
  epics,
  actions
}
