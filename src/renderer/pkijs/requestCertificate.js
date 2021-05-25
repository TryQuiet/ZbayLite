/* global require, Buffer */
const asn1js = require('asn1js')
const {
  CertificationRequest, AttributeTypeAndValue, Extension, Extensions,
  getCrypto, Attribute } = require('pkijs')

const { signAlg, hashAlg } = require('./config')
const { generateKeyPair, dumpPEM } = require('./common')

const userData = {
  country: 'PL',
  name: 'damian',
  onionAddress: 'onionAddresssjgoifgosfksdlfkjrgjspksdhdlgasdas'
}

async function main() {
  const pkcs10 = await requestCertificate({
    countryName: userData.country,
    commonName: userData.name,
    address: userData.onionAddress,
    signAlg,
    hashAlg
  })
  await dumpCertificate(pkcs10)
}

async function requestCertificate({ countryName, commonName, address, signAlg, hashAlg }) {
  const keyPair = await generateKeyPair({ signAlg, hashAlg })
  const pkcs10 = new CertificationRequest({
    version: 0,
    attributes: []
  })
  pkcs10.subject.typesAndValues.push(
    new AttributeTypeAndValue({
      type: '2.5.4.6', // Country name
      value: new asn1js.PrintableString({ value: countryName })
    })
  )
  pkcs10.subject.typesAndValues.push(
    new AttributeTypeAndValue({
      type: '2.5.4.3', // Common name
      value: new asn1js.PrintableString({ value: commonName })
    })
  )
  pkcs10.subject.typesAndValues.push(
    new AttributeTypeAndValue({
      type: '2.5.4.3', // Date Of Birth
      value: new asn1js.CharacterString({ valueDate: address })
    })
  )
  await pkcs10.subjectPublicKeyInfo.importKey(keyPair.publicKey)
  const hashedPublicKey = await getCrypto().digest(
    { name: "SHA-1" },
    pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex)
  pkcs10.attributes.push(
    new Attribute({
      type: "1.2.840.113549.1.9.14", // pkcs-9-at-extensionRequest
      values: [
        (new Extensions({
          extensions: [
            new Extension({
              extnID: "2.5.29.14",
              critical: false,
              extnValue: (new asn1js.OctetString({ valueHex: hashedPublicKey })).toBER(false)
            })
          ]
        })
        ).toSchema()
      ]
    })
  )
  await pkcs10.sign(keyPair.privateKey, hashAlg)
  return { pkcs10, ...keyPair }
}


async function dumpCertificate({ pkcs10, privateKey }) {
  dumpPEM('CERTIFICATE REQUEST', pkcs10.toSchema().toBER(false), 'files/pkcs10.csr')
  dumpPEM('PRIVATE KEY', await getCrypto().exportKey('pkcs8', privateKey), 'files/user_key.pem')
}

main()
