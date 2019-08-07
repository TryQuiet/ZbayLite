import { DateTime } from 'luxon'
import Immutable from 'immutable'
import BigNumber from 'bignumber.js'
import * as R from 'ramda'
import * as Yup from 'yup'

import { packMemo, unpackMemo } from './transit'

export const messageType = {
  BASIC: 1,
  AD: 2,
  TRANSFER: 4
}

export const MessageParticipant = Immutable.Record({
  replyTo: '',
  username: 'Unnamed'
}, 'MessageParticipant')

export const _DisplayableMessage = Immutable.Record({
  id: null,
  type: messageType.BASIC,
  sender: MessageParticipant(),
  receiver: MessageParticipant(),
  createdAt: null,
  message: '',
  spent: new BigNumber(0),
  fromYou: false,
  status: 'broadcasted',
  error: null
}, 'DisplayableMessage')

export const DisplayableMessage = (values) => {
  const record = _DisplayableMessage(values)
  return record.set('sender', MessageParticipant(record.sender))
}

const _isOwner = (address, message) => message.getIn(['sender', 'replyTo']) === address

export const receivedToDisplayableMessage = ({
  message,
  identityAddress
}) => DisplayableMessage(message).set(
  'fromYou', _isOwner(identityAddress, message)
)

export const operationToDisplayableMessage = ({
  operation,
  identityAddress
}) => DisplayableMessage(operation.meta.message).merge({
  error: operation.error,
  status: operation.status,
  id: operation.opId,
  fromYou: _isOwner(identityAddress, operation.meta.message)
})

export const queuedToDisplayableMessage = ({
  messageKey,
  queuedMessage,
  identityAddress
}) => DisplayableMessage(queuedMessage.message).merge({
  fromYou: _isOwner(identityAddress, queuedMessage.message),
  id: messageKey,
  status: 'pending'
})

export const messageSchema = Yup.object().shape({
  type: Yup.number().oneOf(R.values(messageType)).required(),
  sender: Yup.object().shape({
    replyTo: Yup.string().required(),
    username: Yup.string()
  }).required(),
  createdAt: Yup.number().required(),
  message: Yup.string().required()
})

export const transferToMessage = async ({ txid, amount, memo }, isTestnet) => {
  let message = null
  try {
    message = await unpackMemo(memo, isTestnet)
  } catch (err) {
    console.warn(err)
    return null
  }
  try {
    return {
      ...(await messageSchema.validate(message)),
      id: txid,
      spent: new BigNumber(amount)
    }
  } catch (err) {
    console.warn('Incorrect message format: ', err)
    return null
  }
}

export const createMessage = ({ messageData, identity }) => ({
  type: messageData.type,
  sender: {
    replyTo: identity.address,
    username: identity.name
  },
  createdAt: DateTime.utc().toSeconds(),
  message: messageData.data
})

export const messageToTransfer = async ({ message, channel, amount = '0.0001' }) => {
  const memo = await packMemo(message)
  return {
    from: message.sender.replyTo,
    amounts: [
      {
        address: channel.address,
        amount: amount,
        memo
      }
    ]
  }
}

export const transfersToMessages = async (transfers, owner, isTestnet) => {
  const msgs = await Promise.all(transfers.map(t => transferToMessage(t, isTestnet)))
  return msgs.filter(x => x)
}

export const calculateDiff = (oldMsgs, newMsgs) => newMsgs.filter(m => !oldMsgs.includes(m))

export default {
  receivedToDisplayableMessage,
  queuedToDisplayableMessage,
  operationToDisplayableMessage,
  calculateDiff,
  createMessage,
  messageType,
  messageToTransfer,
  transferToMessage,
  transfersToMessages
}
