/* global require Buffer module */

const asn1js = require('asn1js')
const pvutils = require('pvutils')
const fs = require('fs-sync')


// const WebCrypto = require("node-webcrypto-ossl")
// const webcrypto = new WebCrypto() ---- is not a construktor?

const webcrypto = new (require("node-webcrypto-ossl")).Crypto

const { signAlg, hashAlg } = require('./config')
const {
  getAlgorithmParameters, getCrypto, setEngine,
  CryptoEngine, Certificate, CertificationRequest,
  SignedData, ContentInfo } = require('pkijs')


setEngine('newEngine', webcrypto, new CryptoEngine({
  name: '',
  crypto: webcrypto,
  subtle: webcrypto.subtle
}))
const crypto = getCrypto()

async function generateKeyPair({ signAlg, hashAlg }) {
  const algorithm = getAlgorithmParameters(signAlg, 'generatekey')
  if ('hash' in algorithm.algorithm) {
    algorithm.algorithm.hash.name = hashAlg
  }
  const keyPair = await crypto.generateKey(algorithm.algorithm, true, algorithm.usages)
  return keyPair
}

function dumpPEM(tag, body, target) {
  const result = (
    `-----BEGIN ${tag}-----\n` +
    `${formatPEM(Buffer.from(body).toString('base64'))}\n` +
    `-----END ${tag}-----\n`
  )
  fs.write(target, result)
  console.log(`Saved ${target}`)
}

function formatPEM(pemString) {
  const stringLength = pemString.length
  let resultString = ""
  for (let i = 0, count = 0; i < stringLength; i++, count++) {
    if (count > 63) {
      resultString = `${resultString}\n`
      count = 0
    }
    resultString = `${resultString}${pemString[i]}`
  }
  return resultString
}

function loadCertificate(filename) {
  const encodedCertificate = fs.read(filename)
  const clearEncodedCertificate = encodedCertificate.replace(/(-----(BEGIN|END)( NEW)? CERTIFICATE-----|\n)/g, "")
  const certificateBuffer = pvutils.stringToArrayBuffer(pvutils.fromBase64(clearEncodedCertificate))
  const asn1 = asn1js.fromBER(certificateBuffer)
  return new Certificate({ schema: asn1.result })
}

function loadCMS(filename) {
  const encodedCMS = fs.read(filename)
  const clearEncodedCMS = encodedCMS.replace(/(-----(BEGIN|END)( NEW)? CMS-----|\n)/g, "")
  const cmsBuffer = pvutils.stringToArrayBuffer(pvutils.fromBase64(clearEncodedCMS))
  const asn1 = asn1js.fromBER(cmsBuffer)
  //const cmsContentSimpl = new ContentInfo({ schema: asn1.result });
  return new SignedData({ schema: asn1.result })//cmsContentSimpl.content });
}

function loadPrivateKey(filename, signAlg, hashAlg) {
  const encodedKey = fs.read(filename)
  const clearEncodedKey = encodedKey.replace(/(-----(BEGIN|END)( NEW)? PRIVATE KEY-----|\n)/g, "")
  const keyBuffer = pvutils.stringToArrayBuffer(pvutils.fromBase64(clearEncodedKey))
  const algorithm = getAlgorithmParameters(signAlg, 'generatekey')
  if ('hash' in algorithm.algorithm) {
    algorithm.algorithm.hash.name = hashAlg
  }
  return crypto.importKey('pkcs8', keyBuffer, algorithm.algorithm, true, algorithm.usages)
}


function loadCSR(filename) {
  const encodedCertificationRequest = fs.read(filename)
  const clearencodedCertificationRequest = encodedCertificationRequest.replace(/(-----(BEGIN|END)( NEW)? CERTIFICATE REQUEST-----|\n)/g, "")
  const certBuffer = pvutils.stringToArrayBuffer(pvutils.fromBase64(clearencodedCertificationRequest))
  const asn1 = asn1js.fromBER(certBuffer)
  return new CertificationRequest({ schema: asn1.result })
}


module.exports = {
  dumpPEM,
  generateKeyPair,
  loadCertificate,
  loadPrivateKey,
  loadCSR,
  loadCMS
}
