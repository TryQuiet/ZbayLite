/* global require Buffer module */
const { Certificate, ContentInfo, EnvelopedData, CertificateSet, OriginatorInfo } = require('pkijs')

const atob = require('atob')
const asn1js = require('asn1js')
const fs = require('fs')
const { CryptoEngine, setEngine } = require('pkijs')
const pvutils = require('pvutils')
const webcrypto = new (require("node-webcrypto-ossl")).Crypto

let oaepHashAlg = "SHA-1"

setEngine('newEngine', webcrypto, new CryptoEngine({
  name: '',
  crypto: webcrypto,
  subtle: webcrypto.subtle
}))

const encAlg = {
  name: "AES-CBC",
  length: 128
};

let valueBuffer = new ArrayBuffer(0);

function envelopedEncryptInternal(certificateBuffer) {
  //region Decode input certificate
  const asn1 = asn1js.fromBER(certificateBuffer);
  const certSimpl = new Certificate({ schema: asn1.result });
  //endregion

  const cmsEnveloped = new EnvelopedData({
    originatorInfo: new OriginatorInfo({
      certs: new CertificateSet({
        certificates: [certSimpl]
      })
    })
  });

  console.log('cmsEnveloped before...', cmsEnveloped)

  cmsEnveloped.addRecipientByCertificate(certSimpl, { oaepHashAlgorithm: oaepHashAlg });

  console.log('cmsEnveloped after...', cmsEnveloped)

  return cmsEnveloped.encrypt(encAlg, valueBuffer).
    then(
      () => {
        const cmsContentSimpl = new ContentInfo();
        cmsContentSimpl.contentType = "1.2.840.113549.1.7.3";
        cmsContentSimpl.content.name = 'xd'
        console.log('111 before...', cmsContentSimpl.content)
        cmsContentSimpl.content = cmsEnveloped.toSchema();

        console.log('111 after...', cmsContentSimpl.content)

        console.log('222', cmsContentSimpl.content.valueBeforeDecode)

        cmsEnvelopedBuffer = cmsContentSimpl.toSchema().toBER(false);

        console.log('333', cmsEnvelopedBuffer)


      },
      error => Promise.reject(`ERROR DURING ENCRYPTION PROCESS: ${error}`)
    );
}

module.exports = {
  envelopedEncryptInternal
}
