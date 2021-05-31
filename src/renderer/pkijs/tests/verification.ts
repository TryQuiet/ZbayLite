import { getCrypto, getAlgorithmParameters } from 'pkijs'

import { signAlg } from '../generatePems/config'

export const verificationSignature = async (userPubKey, signature, message) => {
  const crypto = getCrypto()
  const algorithm = getAlgorithmParameters(signAlg, 'verify')
  const messageBuffer = Buffer.from(message)

  return await crypto.verify(algorithm.algorithm, userPubKey, signature, messageBuffer)
}
