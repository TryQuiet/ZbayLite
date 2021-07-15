import { DateTime, Settings } from 'luxon'
import BigNumber from 'bignumber.js'
import { messageType } from '../../shared/static'
import config from '../pkijs/generatePems/config'
import { loadPrivateKey } from '../pkijs/generatePems/common'
import { sign } from '@zbayapp/identity'
import { toBase64, arrayBufferToString } from 'pvutils'

import { KeyObject } from 'node:crypto'
Settings.defaultZoneName = 'utc'

const privateKey =
  'MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgM4aywA4/lIyErKAT8Fsp9TSwUpUj44EbS0x15LXTQnagCgYIKoZIzj0DAQehRANCAARTa1q+AaLBjgkvW33rRLB5omfB9ZCHTZVgFlGjBJicGIhTSIvmmZ97F72QcMpsFNjGdQmLzjMeDH2FBRqzrJFh'
let pKey: KeyObject
(async () => {
  console.log('asdfasdf')
  pKey = await loadPrivateKey(privateKey, config.signAlg, config.hashAlg)
})()

export const now = DateTime.utc(2019, 3, 7, 13, 3, 48)

export const identities = [
  {
    address: 'zs1z7rejlpsa98s2rrrfkwmaxu53e4ue0ulcrw0h4x5g8jl04tak0d3mm47vdtahatqrlkngh9slya',
    username: 'Wenus'
  },
  {
    address: 'zs1dhqp9dtr4pksnmaynp2k22qduvywejg3neqq4swd4a6gnz6w0m208kefcdm9n2067yn5clcvgsq',
    username: 'Mars'
  }
]

export const createChannel = (id: number) => ({
  id: id,
  name: `Channel ${id}`,
  private: Boolean(id % 2),
  address: `zs1testaddress${id}`,
  unread: 12,
  description: id % 2 === 0 ? '' : `Channel about ${id}`,
  advertFee: 0.15,
  keys: {
    ivk: `incoming-viewing-key-${id}`,
    sk: 'test-secret-key'
  }
})

export const channels = {
  createChannel
}

export const createVaultMessage = (
  id,
  createdAt = now.minus({ hours: id }).toSeconds(),
  replyTo = 'zs1z7rejlpsa98s2rrrfkwmaxu53e4ue0ulcrw0h4x5g8jl04tak0d3mm47vdtahatqrlkngh9slya'
) => ({
  id,
  status: 'broadcasted',
  spent: new BigNumber('123'),
  type: messageType.BASIC,
  createdAt,
  message: `This is some message ${id}`,
  sender: {
    replyTo,
    username: 'test'
  }
})

export const createMessage = async () => {
  let pKey = await loadPrivateKey(privateKey, config.signAlg, config.hashAlg)
  const id = 'qwerrtuu'
  console.log(pKey)
  const signature = await sign(`i`, pKey)
  const signature2 = await sign(`i`, pKey)
  console.log(toBase64(arrayBufferToString(signature)))
  console.log(toBase64(arrayBufferToString(signature2)))
  return {
    id,
    type: messageType.BASIC,
    message: 'example message',
    pubKey: 'ownPubKey',
    channelId: 'address',
    createdAt: 123445789,
    signature: arrayBufferToString(signature)
  }
}

export const createMultipleMessages = () => {

}



export const messages = {
  createMessage,
  createVaultMessage
}

export const createIdentity = ({
  name = 'Saturn',
  address = 'saturn-private-address',
  transparentAddress = 'saturn-transparent-address',
  signerPrivKey = 'AyrXTov+4FEyle1BrxndDhePlUOB1nPV5YvyexC8m6E=',
  signerPubKey = 'Alw9G29ahXm5et9T7FJF3lbXVXNkapR826yPtfMVJYnK',
  keys = {
    tpk: 'saturn-tpk',
    sk: 'saturn-sk'
  },
  shippingData = {
    firstName: 'Saturn',
    lastName: 'the Planet',
    street: 'Coders Dv',
    country: 'Poland',
    region: 'Malopolska',
    city: 'Krakow',
    postalCode: '1337-455'
  }
} = {}) => ({
  name,
  address,
  transparentAddress,
  signerPrivKey,
  signerPubKey,
  shippingData,
  keys
})

const dupa = async ()=> {
  await createMessage()
  await createMessage()
  await createMessage()
  await createMessage()
  await createMessage()
  await createMessage()
  await createMessage()
  await createMessage()
  await createMessage()
  await createMessage()
}

dupa()

export default {
  identities,
  now,
  channels,
  messages,
  createIdentity,
  createMessage
}
