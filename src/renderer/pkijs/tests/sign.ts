import fs from 'fs'
import { getCrypto, getAlgorithmParameters } from 'pkijs'

import { signAlg } from '../generatePems/config'

export const signing = async (message, privKey) => {
  const crypto = getCrypto()
  const messageBuffer = Buffer.from(message)
  const algorithm = getAlgorithmParameters(signAlg, 'sign')

  return crypto.sign(algorithm.algorithm, privKey, messageBuffer)
}
