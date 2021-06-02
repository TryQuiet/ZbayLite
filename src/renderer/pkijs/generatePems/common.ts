import { fromBER } from 'asn1js'
import { stringToArrayBuffer, fromBase64 } from 'pvutils'
import fs from 'fs-sync'
import {
  getAlgorithmParameters, getCrypto, setEngine,
  CryptoEngine, Certificate, CertificationRequest,
  SignedData
} from 'pkijs'

export enum CertFieldsTypes {
  commonName = '2.5.4.3',
  nickName = '1.3.6.1.4.1.50715.2.1',
  peerId = '1.3.6.1.2.1.15.3.1.1'
}

const webcrypto = new (require('node-webcrypto-ossl')).Crypto()
setEngine('newEngine', webcrypto, new CryptoEngine({
  name: '',
  crypto: webcrypto,
  subtle: webcrypto.subtle
}))
const crypto = getCrypto()

export const generateKeyPair = async ({ signAlg, hashAlg }) => {
  const algorithm = getAlgorithmParameters(signAlg, 'generatekey')
  if ('hash' in algorithm.algorithm) {
    algorithm.algorithm.hash.name = hashAlg
  }
  const keyPair = await crypto.generateKey(algorithm.algorithm, true, algorithm.usages)

  return keyPair
}

export const dumpPEM = (tag, body, target) => {
  const result = (
    `-----BEGIN ${tag}-----\n` +
    `${formatPEM(Buffer.from(body).toString('base64'))}\n` +
    `-----END ${tag}-----\n`
  )
  fs.write(target, result)
  console.log(`Saved ${target}`)
}

export const formatPEM = (pemString) => {
  const stringLength = pemString.length
  let resultString = ''
  for (let i = 0, count = 0; i < stringLength; i++, count++) {
    if (count > 63) {
      resultString = `${resultString}\n`
      count = 0
    }
    resultString = `${resultString}${pemString[i]}`
  }
  return resultString
}

export const loadCertificate = (rootCert) => {
  const certificateBuffer = stringToArrayBuffer(fromBase64(rootCert))
  const asn1 = fromBER(certificateBuffer)
  return new Certificate({ schema: asn1.result })
}

export const loadCMS = (filename) => {
  const encodedCMS = fs.read(filename)
  const clearEncodedCMS = encodedCMS.replace(/(-----(BEGIN|END)( NEW)? CMS-----|\n)/g, '')
  const cmsBuffer = stringToArrayBuffer(fromBase64(clearEncodedCMS))
  const asn1 = fromBER(cmsBuffer)
  // const cmsContentSimpl = new ContentInfo({ schema: asn1.result });
  return new SignedData({ schema: asn1.result }) // cmsContentSimpl.content });
}

export const loadPrivateKey = (filename, signAlg, hashAlg) => {
  console.log("key", filename)
  const keyBuffer = stringToArrayBuffer(fromBase64(filename))
  console.log("buffer", keyBuffer)

  const algorithm = getAlgorithmParameters(signAlg, 'generatekey')
  if ('hash' in algorithm.algorithm) {
    algorithm.algorithm.hash.name = hashAlg
  }
  return crypto.importKey('pkcs8', keyBuffer, algorithm.algorithm, true, algorithm.usages)
}

export const loadCSR = (csr) => {
  const certBuffer = stringToArrayBuffer(fromBase64(csr))
  const asn1 = fromBER(certBuffer)
  return new CertificationRequest({ schema: asn1.result })
}
