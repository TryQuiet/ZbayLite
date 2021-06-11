import { fromBase64, stringToArrayBuffer } from 'pvutils'
import { Certificate, getAlgorithmParameters, getCrypto, setEngine, CryptoEngine } from 'pkijs'
import { fromBER } from 'asn1js'

import config from '../generatePems/config'

import { Crypto } from '@peculiar/webcrypto'
const webcrypto = new Crypto()

setEngine('newEngine', webcrypto, new CryptoEngine({
  name: '',
  crypto: webcrypto,
  subtle: webcrypto.subtle
}))

const parseCertificate = (pem) => {
  let certificateBuffer = new ArrayBuffer(0)
  certificateBuffer = stringToArrayBuffer(fromBase64(pem))
  const asn1 = fromBER(certificateBuffer)
  return new Certificate({ schema: asn1.result })
}

const keyFromCertificate = (certificate) => {
  return Buffer.from(certificate.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex).toString('base64')
}

const keyObjectFromString = (pubKeyString) => {
  const crypto = getCrypto()
  let keyArray = new ArrayBuffer(0)
  keyArray = stringToArrayBuffer(fromBase64(pubKeyString))
  const algorithm = getAlgorithmParameters(config.signAlg, 'generatekey')
  if ('hash' in algorithm.algorithm) {
    algorithm.algorithm.hash.name = config.hashAlg
  }

  return crypto.importKey('raw', keyArray, algorithm.algorithm, true, algorithm.usages)
}

export const extractPubKey = async (pem) => {
  const certificate = parseCertificate(pem)
  const pubKeyString = keyFromCertificate(certificate)
  return keyObjectFromString(pubKeyString)
}
