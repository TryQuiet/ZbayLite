import { Certificate, ContentInfo, EnvelopedData, CertificateSet, OriginatorInfo } from 'pkijs'

import atob from 'atob'
const asn1js = require('asn1js')
const fs = require('fs')
const { CryptoEngine, setEngine } = require('pkijs')
const webcrypto = new (require("node-webcrypto-ossl")).Crypto
const { stringToArrayBuffer, fromBase64, toBase64, arrayBufferToString } = require("pvutils");


let certificateBuffer = new ArrayBuffer(0)
let cmsEnvelopedBuffer = new ArrayBuffer(0)
let privateKeyBuffer = new ArrayBuffer(0);

function envelopedDecryptInternal() {
  let asn1 = asn1js.fromBER(certificateBuffer)
  console.log('siema0', asn1)
  const certSimpl = new Certificate({ schema: asn1.result })

  asn1 = asn1js.fromBER(cmsEnvelopedBuffer)
  console.log('siema1', asn1)
  const cmsContentSimpl = new ContentInfo({ schema: asn1.result })
  console.log('siema2')
  const cmsEnvelopedSimp = new EnvelopedData({ schema: cmsContentSimpl.content })

  return cmsEnvelopedSimp.decrypt(0,
    {
      recipientCertificate: certSimpl,
      recipientPrivateKey: privateKeyBuffer
    }).then(
      result => result,
      error => Promise.reject(`ERROR DURING DECRYPTION PROCESS: ${error}`)
    );
}


export function envelopedDecrypt(encodedCertificate, encodedPrivateKey, encodedCMSEnveloped) {
  return Promise.resolve().then(() => {
    const clearEncodedCertificate = encodedCertificate.replace(/(-----(BEGIN|END)( NEW)? CERTIFICATE-----|\n)/g, "")
    certificateBuffer = stringToArrayBuffer(fromBase64(clearEncodedCertificate));
    console.log('\n encodedCertificate \n', encodedCertificate)

    const clearPrivateKey = encodedPrivateKey.replace(/(-----(BEGIN|END)( NEW)? PRIVATE KEY-----|\n)/g, "")
    privateKeyBuffer = stringToArrayBuffer(fromBase64(clearPrivateKey));
    console.log('\n encodedCMSEnveloped \n', encodedCMSEnveloped)

    const clearEncodedCMSEnveloped = encodedCMSEnveloped.replace(/(-----(BEGIN|END)( NEW)? CMS-----|\n)/g, "")
    cmsEnvelopedBuffer = stringToArrayBuffer(fromBase64(clearEncodedCMSEnveloped))

  }).then(() => envelopedDecryptInternal()).then(result => {

    console.log("wynik", arrayBufferToString(result))
  })
}