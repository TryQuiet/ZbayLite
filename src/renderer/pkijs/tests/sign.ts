import fs from 'fs'
import { getCrypto, getAlgorithmParameters } from 'pkijs'
import { fromBase64, stringToArrayBuffer } from 'pvutils'

import { signAlg, hashAlg } from '../generatePems/config'

const parsePrivKey = (privKey) => {
  let privKeyBuffer = new ArrayBuffer(0)
  const userPrivKey = fs.readFileSync(privKey, 'utf-8')
  const clearPrivateKey = userPrivKey.replace(/(-----(BEGIN|END)( NEW)? PRIVATE KEY-----|\n)/g, "")
  privKeyBuffer = stringToArrayBuffer(fromBase64(clearPrivateKey))

  return privKeyBuffer
}

const createKeyObject = (privKeyBuffer) => {
  const crypto = getCrypto()
  const algorithm = getAlgorithmParameters(signAlg, 'generatekey')
  if ('hash' in algorithm.algorithm) {
    algorithm.algorithm.hash.name = hashAlg
  }

  return crypto.importKey('pkcs8', privKeyBuffer, algorithm.algorithm, true, algorithm.usages)
}

export const signing = async (message, privKey) => {
  const crypto = getCrypto()
  const messageBuffer = Buffer.from(message)
  const algorithm = getAlgorithmParameters(signAlg, 'sign')
  const privKeyBuffer = parsePrivKey(privKey)
  const userPrivKey = await createKeyObject(privKeyBuffer)

  return crypto.sign(algorithm.algorithm, userPrivKey, messageBuffer)
}
