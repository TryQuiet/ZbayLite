/* global require Buffer module */
const { Certificate, ContentInfo, EnvelopedData, CertificateSet, OriginatorInfo } = require('pkijs')

const atob = require('atob')
const asn1js = require('asn1js')
const fs = require('fs')
const { CryptoEngine, setEngine } = require('pkijs')
const webcrypto = new (require("node-webcrypto-ossl")).Crypto
const { stringToArrayBuffer, fromBase64, toBase64, arrayBufferToString } = require("pvutils");

let oaepHashAlg = "sha-1"

setEngine('newEngine', webcrypto, new CryptoEngine({
  name: '',
  crypto: webcrypto,
  subtle: webcrypto.subtle
}))

const encAlg = {
  name: "AES-CBC",
  length: 128
};

let valueBuffer = new ArrayBuffer(0)

function formatPEM(pemString) {
  const PEM_STRING_LENGTH = pemString.length, LINE_LENGTH = 64
  const wrapNeeded = PEM_STRING_LENGTH > LINE_LENGTH

  if (wrapNeeded) {
    let formattedString = "", wrapIndex = 0

    for (let i = LINE_LENGTH; i < PEM_STRING_LENGTH; i += LINE_LENGTH) {
      formattedString += pemString.substring(wrapIndex, i) + "\r\n"
      wrapIndex = i
    }

    formattedString += pemString.substring(wrapIndex, PEM_STRING_LENGTH)
    return formattedString
  }
  else {
    return pemString
  }
}


const envelopedEncryptInternal = async () => {
  const asn1 = asn1js.fromBER(certificateBuffer)
  const certSimpl = new Certificate({ schema: asn1.result })

  const cmsEnveloped = new EnvelopedData({
    originatorInfo: new OriginatorInfo({
      certs: new CertificateSet({
        certificates: [certSimpl]
      })
    })
  })

  cmsEnveloped.addRecipientByCertificate(certSimpl, { oaepHashAlgorithm: oaepHashAlg })

  return cmsEnveloped.encrypt(encAlg, valueBuffer)
    .then(() => {
      const cmsContentSimpl = new ContentInfo()
      cmsContentSimpl.contentType = "1.2.840.113549.1.7.3"
      cmsContentSimpl.content = cmsEnveloped.toSchema()
      cmsEnvelopedBuffer = cmsContentSimpl.toSchema().toBER(false)
    },
      error => Promise.reject(`ERROR DURING ENCRYPTION PROCESS: ${error}`)
    )
}


const envelopedEncrypt = async (encodedCertificate, message) => {
  await Promise.resolve()
    .then(() => {
      const clearEncodedCertificate = encodedCertificate.replace(/(-----(BEGIN|END)( NEW)? CERTIFICATE-----|\n)/g, "")
      certificateBuffer = stringToArrayBuffer(fromBase64(clearEncodedCertificate))
      valueBuffer = stringToArrayBuffer(message)
    })
    .then(() => envelopedEncryptInternal()).then(() => {
      let resultString = "-----BEGIN CMS-----\r\n"
      resultString = `${resultString}${formatPEM(toBase64(arrayBufferToString(cmsEnvelopedBuffer)))}`
      resultString = `${resultString}\r\n-----END CMS-----\r\n`
      console.log("Encryption process finished successfully : ")
      console.log(resultString)
      return resultString
    });
}









function envelopedDecryptInternal() {
  //region Decode input certificate
  let asn1 = asn1js.fromBER(certificateBuffer);
  const certSimpl = new Certificate({ schema: asn1.result });
  //endregion

  //region Decode CMS Enveloped content
  asn1 = asn1js.fromBER(cmsEnvelopedBuffer);
  const cmsContentSimpl = new ContentInfo({ schema: asn1.result });
  const cmsEnvelopedSimp = new EnvelopedData({ schema: cmsContentSimpl.content });
  //endregion

  return cmsEnvelopedSimp.decrypt(0,
    {
      recipientCertificate: certSimpl,
      recipientPrivateKey: privateKeyBuffer
    }).then(
      result => result,
      error => Promise.reject(`ERROR DURING DECRYPTION PROCESS: ${error}`)
    );
}


function envelopedDecrypt(encodedCertificate, encodedPrivateKey) {
  return Promise.resolve().then(() => {
    const clearEncodedCertificate = encodedCertificate.replace(/(-----(BEGIN|END)( NEW)? CERTIFICATE-----|\n)/g, "");
    certificateBuffer = stringToArrayBuffer(window.atob(clearEncodedCertificate));

    // noinspection InnerHTMLJS
    const clearPrivateKey = encodedPrivateKey.replace(/(-----(BEGIN|END)( NEW)? PRIVATE KEY-----|\n)/g, "");
    privateKeyBuffer = stringToArrayBuffer(window.atob(clearPrivateKey));

    // noinspection InnerHTMLJS
    const encodedCMSEnveloped = document.getElementById("encrypted_content").value;
    const clearEncodedCMSEnveloped = encodedCMSEnveloped.replace(/(-----(BEGIN|END)( NEW)? CMS-----|\n)/g, "");
    cmsEnvelopedBuffer = stringToArrayBuffer(window.atob(clearEncodedCMSEnveloped));
  }).then(() => envelopedDecryptInternal()).then(result => {
    // noinspection InnerHTMLJS
    document.getElementById("decrypted_content").innerHTML = arrayBufferToString(result);
  });
}








module.exports = {
  envelopedEncryptInternal,
  envelopedEncrypt
}
