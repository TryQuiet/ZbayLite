import { produce, immerable } from 'immer'
import { createAction, handleActions } from 'redux-actions'
import { ipcRenderer } from 'electron'
import { actionTypes } from '../../../shared/static'

import { ActionsType, PayloadType } from './types'

class Logs {
  transactionLogs: any[]
  applicationLogs: any[]
  nodeLogs: any[]
  islogsFileLoaded: boolean
  isLogWindowOpened: boolean

  constructor(values?: Partial<Logs>) {
    Object.assign(this, values)
    this[immerable] = true
  }
}

export const initialState: Logs = {
  ...new Logs({
    transactionLogs: [],
    applicationLogs: [],
    nodeLogs: [],
    islogsFileLoaded: false,
    isLogWindowOpened: false
  })
}

export type LogsStore = Logs

const setTransactionLogs = createAction(actionTypes.SET_TRANSACTIONS_LOGS)
const setApplicationLogs = createAction(actionTypes.SET_APPLICATIONS_LOGS)
const setNodeLogs = createAction(actionTypes.SET_NODE_LOGS)
const setLogWindowOpened = createAction<boolean>(actionTypes.SET_LOG_WINDOW_OPENED)

const loadTargetLogs = () => async (dispatch, getState) => {
  ipcRenderer.send('load-logs')
  dispatch(setLogWindowOpened(true))
}

const closeLogsWindow = () => async (dispatch, getState) => {
  ipcRenderer.send('disable-load-logs')
  dispatch(setLogWindowOpened(false))
}

const saveLogs = data => async (dispatch, getState) => {
  ipcRenderer.send('save-to-log-file', data)
}

export const actions = {
  setTransactionLogs,
  setApplicationLogs,
  setNodeLogs,
  setLogWindowOpened
}

export type LogsActions = ActionsType<typeof actions>

export const epics = {
  loadTargetLogs,
  closeLogsWindow,
  saveLogs
}

export const reducer = handleActions<LogsStore, PayloadType<LogsActions>>(
  {
    [setTransactionLogs.toString()]: (
      state,
      { payload: transactionLogs }: LogsActions['setTransactionLogs']
    ) =>
      produce(state, draft => {
        draft.transactionLogs = transactionLogs
      }),
    [setApplicationLogs.toString()]: (
      state,
      { payload: ApplicationLogs }: LogsActions['setApplicationLogs']
    ) =>
      produce(state, draft => {
        draft.applicationLogs = ApplicationLogs
      }),
    [setNodeLogs.toString()]: (state, { payload: setNodeLogs }: LogsActions['setNodeLogs']) =>
      produce(state, draft => {
        draft.nodeLogs = setNodeLogs
      }),
    [setLogWindowOpened.toString()]: (
      state,
      { payload: logPanelStatus }: LogsActions['setLogWindowOpened']
    ) =>
      produce(state, draft => {
        draft.isLogWindowOpened = logPanelStatus
      })
  },
  initialState
)

export default {
  actions,
  epics,
  reducer
}
