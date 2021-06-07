import { fromBER } from 'asn1js'
import { stringToArrayBuffer, fromBase64 } from 'pvutils'
import fs from 'fs'
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

const { Crypto } = require("@peculiar/webcrypto")
const webcrypto = new Crypto()

setEngine('newEngine', webcrypto, new CryptoEngine({
  name: '',
  crypto: webcrypto,
  subtle: webcrypto.subtle
}))
const crypto = getCrypto()

export const generateKeyPair = async ({ signAlg, hashAlg }) => {
  console.log('p111')
  const algorithm = getAlgorithmParameters(signAlg, 'generatekey')
  console.log('p222')

  if ('hash' in algorithm.algorithm) {
    algorithm.algorithm.hash.name = hashAlg
  }
  console.log('p333')

  const keyPair = await crypto.generateKey(algorithm.algorithm, true, algorithm.usages)
  console.log('p444')

  return keyPair
}

export const dumpPEM = (tag, body, target) => {
  const result = (
    `-----BEGIN ${tag}-----\n` +
    `${formatPEM(Buffer.from(body).toString('base64'))}\n` +
    `-----END ${tag}-----\n`
  )
  fs.writeSync(target, result)
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

export const loadCertificateFromPem = (filename) => {
  const encodedCertificate = fs.readFileSync(`${process.cwd()}${filename}`).toString('utf-8')
  return encodedCertificate.replace(/(-----(BEGIN|END)( NEW)? CERTIFICATE-----|\n)/g, "")
}

export const loadCMS = (filename) => {
  const encodedCMS = fs.readFileSync(`${process.cwd()}${filename}`).toString('utf-8')
  const clearEncodedCMS = encodedCMS.replace(/(-----(BEGIN|END)( NEW)? CMS-----|\n)/g, '')
  const cmsBuffer = stringToArrayBuffer(fromBase64(clearEncodedCMS))
  const asn1 = fromBER(cmsBuffer)
  // const cmsContentSimpl = new ContentInfo({ schema: asn1.result });
  return new SignedData({ schema: asn1.result }) // cmsContentSimpl.content });
}

export const loadPrivateKey = (filename, signAlg, hashAlg) => {
  const keyBuffer = stringToArrayBuffer(fromBase64(filename))

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


