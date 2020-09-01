import { ipcRenderer, remote } from 'electron'
import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import { createAction, handleActions } from 'redux-actions'
import { actionTypes } from '../../../shared/static'
import { actionCreators } from './modals'
import nodeHandlers from './node'
import client from '../../zcash'
import history from '../../../shared/history'
import electronStore from '../../../shared/electronStore'

export const AppState = Immutable.Record(
  {
    version: null,
    transfers: Immutable.Map(),
    newUser: false,
    modalTabToOpen: null,
    allTransfersCount: 0,
    newTransfersCounter: 0,
    directMessageQueueLock: false,
    messageQueueLock: false,
    isInitialLoadFinished: false
  },
  'AppState'
)

export const initialState = AppState()

const loadVersion = createAction(actionTypes.SET_APP_VERSION, () =>
  remote.app.getVersion()
)
const setTransfers = createAction(actionTypes.SET_TRANSFERS)
const setModalTab = createAction(actionTypes.SET_CURRENT_MODAL_TAB)
const clearModalTab = createAction(actionTypes.CLEAR_CURRENT_MODAL_TAB)
const setAllTransfersCount = createAction(actionTypes.SET_ALL_TRANSFERS_COUNT)
const setNewTransfersCount = createAction(actionTypes.SET_NEW_TRANSFERS_COUNT)
const lockDmQueue = createAction(actionTypes.LOCK_DM_QUEUE)
const unlockDmQueue = createAction(actionTypes.UNLOCK_DM_QUEUE)
const lockMessageQueue = createAction(actionTypes.LOCK_MESSAGE_QUEUE)
const unlockMessageQueue = createAction(actionTypes.UNLOCK_MESSAGE_QUEUE)
const setInitialLoadFlag = createAction(actionTypes.SET_INITIAL_LOAD_FLAG)
const reduceNewTransfersCount = createAction(
  actionTypes.REDUCE_NEW_TRANSFERS_COUNT
)

export const actions = {
  loadVersion,
  setTransfers,
  setModalTab,
  clearModalTab,
  setAllTransfersCount,
  setNewTransfersCount,
  reduceNewTransfersCount,
  lockDmQueue,
  unlockDmQueue,
  lockMessageQueue,
  unlockMessageQueue,
  setInitialLoadFlag
}

export const askForBlockchainLocation = () => async (dispatch, getState) => {
  dispatch(actionCreators.openModal('blockchainLocation')())
}

export const proceedWithSyncing = payload => async (dispatch, getState) => {
  ipcRenderer.send('proceed-with-syncing', payload)
  dispatch(actionCreators.closeModal('blockchainLocation')())
}

export const restartAndRescan = () => async (dispatch, getState) => {
  client.rescan()
  await dispatch(
    nodeHandlers.actions.setStatus({
      currentBlock: new BigNumber(0)
    })
  )
  await dispatch(nodeHandlers.actions.setIsRescanning(true))
  setTimeout(() => {
    history.push(`/vault`)
    electronStore.set('channelsToRescan', {})
  }, 500)
}

export const reducer = handleActions(
  {
    [setNewTransfersCount]: (state, { payload: setNewTransfersCount }) =>
      state.set('newTransfersCounter', setNewTransfersCount),
    [setInitialLoadFlag]: (state, { payload: flag }) =>
      state.set('isInitialLoadFinished', flag),
    [reduceNewTransfersCount]: (state, { payload: amount }) =>
      state.update('newTransfersCounter', count => count - amount),
    [loadVersion]: (state, { payload: version }) =>
      state.set('version', version),
    [setModalTab]: (state, { payload: tabName }) =>
      state.set('modalTabToOpen', tabName),
    [setAllTransfersCount]: (state, { payload: transfersCount }) =>
      state.set('allTransfersCount', transfersCount),
    [clearModalTab]: state => state.set('modalTabToOpen', null),
    [lockDmQueue]: state => state.set('directMessageQueueLock', true),
    [unlockDmQueue]: state => state.set('directMessageQueueLock', false),
    [lockMessageQueue]: state => state.set('messageQueueLock', true),
    [unlockMessageQueue]: state => state.set('messageQueueLock', false),
    [setTransfers]: (state, { payload: { id, value } }) => {
      return state.setIn(['transfers', id], value)
    }
  },
  initialState
)

export const epics = {
  askForBlockchainLocation,
  proceedWithSyncing,
  restartAndRescan
}

export default {
  epics,
  actions,
  reducer
}
