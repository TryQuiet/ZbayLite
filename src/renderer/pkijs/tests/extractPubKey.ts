import { fromBase64, stringToArrayBuffer } from 'pvutils'
import { Certificate, getAlgorithmParameters, getCrypto, setEngine, CryptoEngine } from 'pkijs'
import fs from 'fs'
import { fromBER } from 'asn1js'

import { hashAlg, signAlg } from '../generatePems/config'

const webcrypto = new (require('node-webcrypto-ossl')).Crypto()
setEngine('newEngine', webcrypto, new CryptoEngine({
  name: '',
  crypto: webcrypto,
  subtle: webcrypto.subtle
}))

const parseCertificate = (pem) => {
  let certificateBuffer = new ArrayBuffer(0)
  const userCert = fs.readFileSync(pem, 'utf-8')
  const clearEncodedCertificate = userCert.replace(/(-----(BEGIN|END)( NEW)? CERTIFICATE-----|\n)/g, '')
  certificateBuffer = stringToArrayBuffer(fromBase64(clearEncodedCertificate))
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
  const algorithm = getAlgorithmParameters(signAlg, 'generatekey')
  if ('hash' in algorithm.algorithm) {
    algorithm.algorithm.hash.name = hashAlg
  }

  return crypto.importKey('raw', keyArray, algorithm.algorithm, true, algorithm.usages)
}

export const extractPubKey = async (pem) => {
  const certificate = parseCertificate(pem)
  const pubKeyString = keyFromCertificate(certificate)

  return keyObjectFromString(pubKeyString)
}
