import crypto from 'crypto'
import { IConversation } from '../store/handlers/directMessages'

export const constants = {
  IVO: '5183666c72eec9e45183666c72eec9e4',
  prime: 'b25dbea8c5f6c0feff269f88924a932639f8d8f937d19fa5874188258a63a373',
  generator: '02'
}

export const encodeMessage = (sharedSecret: string, message: string): string => {
  const ENC_KEY = Buffer.from(sharedSecret.substring(0, 64), 'hex')
  const IV = Buffer.from(constants.IVO, 'hex')

  const cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV)
  let encrypted = cipher.update(message, 'utf8', 'base64')
  encrypted += cipher.final('base64')
  return encrypted
}

export const decodeMessage = (sharedSecret: string, message: string): string => {
  const ENC_KEY = Buffer.from(sharedSecret.substring(0, 64), 'hex')
  const IV = Buffer.from(constants.IVO, 'hex')

  const decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV)
  const decrypted = decipher.update(message, 'base64', 'utf8')
  return decrypted + decipher.final('utf8')
}

export const checkConversation = (
  id: string,
  encryptedPhrase: string,
  privKey: string
): IConversation | null => {
  const dh = crypto.createDiffieHellman(constants.prime, 'hex', constants.generator, 'hex')
  dh.setPrivateKey(privKey, 'hex')
  const sharedSecret = dh.computeSecret(id, 'hex').toString('hex')
  let decodedMessage = null
  try {
    decodedMessage = decodeMessage(sharedSecret, encryptedPhrase)
  } catch (err) {
    console.log('cannot decode message, its not for me or I am the author')
  }
  if (decodedMessage?.startsWith('no panic')) {
    console.log('success, message decoded successfully')

    return {
      sharedSecret,
      contactPublicKey: decodedMessage.slice(8),
      conversationId: id
    }
  } else {
    return null
  }
}
