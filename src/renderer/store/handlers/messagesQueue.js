import { produce } from 'immer'
import * as R from 'ramda'
import crypto from 'crypto'
import { createAction, handleActions } from 'redux-actions'

import selectors from '../selectors/messagesQueue'
import channelsSelectors from '../selectors/channels'
import identitySelectors from '../selectors/identity'
import appSelectors from '../selectors/app'
import { messageToTransfer } from '../../zbay/messages'
import notificationsHandlers from './notifications'
import appHandlers from './app'
import { errorNotification } from './utils'
import { getClient } from '../../zcash'
import { actionTypes } from '../../../shared/static'

export const DEFAULT_DEBOUNCE_INTERVAL = 2000

export const PendingMessage = {
  channelId: '',
  message: null
}

export const initialState = {}

const addMessage = createAction(
  actionTypes.ADD_PENDING_MESSAGE,
  ({ message, channelId }) => {
    const messageDigest = crypto.createHash('sha256')
    const messageEssentials = R.pick(['type', 'sender', 'signature'])(message)
    return {
      key: messageDigest
        .update(
          JSON.stringify({
            ...messageEssentials,
            channelId
          })
        )
        .digest('hex'),
      message,
      channelId
    }
  }
)
const removeMessage = createAction(actionTypes.REMOVE_PENDING_MESSAGE)

export const actions = {
  addMessage,
  removeMessage
}
const _sendPendingMessages = async (dispatch, getState) => {
  const lock = appSelectors.messageQueueLock(getState())
  const messages = Array.from(Object.values(selectors.queue(getState())))
  if (lock === false) {
    await dispatch(appHandlers.actions.lockMessageQueue())
  } else {
    if (messages.size !== 0) {
      dispatch(sendPendingMessages())
    }
    return
  }
  const donation = identitySelectors.donation(getState())
  await Promise.all(
    messages
      .map(async (msg, key) => {
        const channel = channelsSelectors.channelById(msg.channelId)(getState())
        const identityAddress = identitySelectors.address(getState())
        const transfer = await messageToTransfer({
          message: msg.message.toJS(),
          address: channel.get('address'),
          identityAddress,
          donation
        })
        try {
          await getClient().payment.send(transfer)
        } catch (err) {
          dispatch(
            notificationsHandlers.actions.enqueueSnackbar(
              errorNotification({
                message:
                  "Couldn't send the message, please check node connection."
              })
            )
          )
          return
        }
        dispatch(removeMessage(key))
      })
      .values()
  )
  await dispatch(appHandlers.actions.unlockMessageQueue())
}

export const sendPendingMessages = (debounce = null) => {
  const thunk = _sendPendingMessages
  thunk.meta = {
    debounce: {
      time:
        debounce !== null
          ? debounce
          : process.env.ZBAY_DEBOUNCE_MESSAGE_INTERVAL ||
            DEFAULT_DEBOUNCE_INTERVAL,
      key: 'SEND_PENDING_DRIRECT_MESSAGES'
    }
  }
  return thunk
}

const addMessageEpic = payload => async (dispatch, getState) => {
  dispatch(addMessage(payload))
  await dispatch(sendPendingMessages())
}

export const epics = {
  sendPendingMessages,
  addMessage: addMessageEpic,
  resetMessageDebounce: sendPendingMessages
}

export const reducer = handleActions(
  {
    [addMessage]: (state, { payload: { channelId, message, key } }) =>
      produce(state, (draft) => {
        draft[key] = {
          ...PendingMessage,
          channelId,
          message
        }
      }),
    [removeMessage]: (state, { payload: key }) => produce(state, (draft) => {
      delete draft[key]
    })
  },
  initialState
)

export default {
  actions,
  epics,
  reducer
}
