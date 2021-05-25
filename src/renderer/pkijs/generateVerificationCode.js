/* global require, Buffer */
const asn1js = require('asn1js')
const { SignedData, SignerInfo, EncapsulatedContentInfo, IssuerAndSerialNumber,
  SignedAndUnsignedAttributes, Attribute, getCrypto } = require('pkijs')
const { loadCertificate, loadPrivateKey, dumpPEM } = require('./common')
const { signAlg, hashAlg } = require('./config')


async function main() {
  const dataBuffer = new ArrayBuffer(0)
  const userCert = 'files/user_cert.pem'
  const privateKeyFile = 'files/user_key.pem'
  const certificate = await loadCertificate(userCert)
  const privateKey = await loadPrivateKey(privateKeyFile, signAlg, hashAlg)
  const messageDigest = await getCrypto().digest({ name: hashAlg }, new Uint8Array(dataBuffer))
  const signedData = new SignedData({
    encapContentInfo: new EncapsulatedContentInfo({
      eContentType: '1.2.840.113549.1.7.1', // 'data' content type
      eContent: new asn1js.OctetString({ valueHex: dataBuffer })
    }),
    signerInfos: [
      new SignerInfo({
        version: 1,
        sid: new IssuerAndSerialNumber({
          issuer: certificate.issuer,
          serialNumber: certificate.serialNumber
        }),
        signedAttrs: new SignedAndUnsignedAttributes({
          type: 0,
          attributes: [
            new Attribute({
              type: "1.2.840.113549.1.9.3",
              values: [
                new asn1js.ObjectIdentifier({ value: "1.2.840.113549.1.7.1" })
              ]
            }), // contentType
            new Attribute({
              type: '1.2.840.113549.1.9.5',
              values: [
                new asn1js.UTCTime({ valueDate: new Date() }) //signing time
              ]
            }),
            new Attribute({
              type: "1.2.840.113549.1.9.4",
              values: [
                new asn1js.OctetString({ valueHex: messageDigest })
              ]
            }) // messageDigest

          ]
        })
      })
    ],
    certificates: [certificate]
  })
  await signedData.sign(privateKey, 0, hashAlg)
  dumpPEM('CMS', signedData.toSchema().toBER(false), 'files/cms.pem')
}

main()
