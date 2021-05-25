/* global require, Buffer */

const asn1js = require('asn1js')
const {
  Certificate, AttributeTypeAndValue, BasicConstraints, Extension,
  getAlgorithmParameters, getCrypto, setEngine, CryptoEngine, Time } = require('pkijs')

const { signAlg, hashAlg } = require('./config')
const { generateKeyPair, dumpPEM } = require('./common')

const communityName = 'community name'

async function main() {
  const rootCA = await generateRootCA({
    countryName: 'UK',
    commonName: `${communityName} CA`,
    signAlg,
    hashAlg
  })
  await dumpCertificate(rootCA)
}

async function generateRootCA({ countryName, commonName, signAlg, hashAlg }) {
  const basicConstr = new BasicConstraints({ cA: true, pathLenConstraint: 3 })
  const keyUsage = getCAKeyUsage()
  const certificate = new Certificate({
    serialNumber: new asn1js.Integer({ value: 1 }),
    extensions: [
      new Extension({
        extnID: '2.5.29.19',
        critical: false,
        extnValue: basicConstr.toSchema().toBER(false),
        parsedValue: basicConstr // Parsed value for well-known extensions
      }),
      new Extension({
        extnID: '2.5.29.15',
        critical: false,
        extnValue: keyUsage.toBER(false),
        parsedValue: keyUsage // Parsed value for well-known extensions
      })
    ],
    notBefore: new Time({ type: 1, value: new Date() }),
    notAfter: new Time({ type: 1, value: new Date(2020, 1, 1) })
  })
  certificate.issuer.typesAndValues.push(
    new AttributeTypeAndValue({
      type: '2.5.4.6', // Country name
      value: new asn1js.PrintableString({ value: countryName })
    })
  )
  certificate.issuer.typesAndValues.push(
    new AttributeTypeAndValue({
      type: '2.5.4.3', // Common name
      value: new asn1js.PrintableString({ value: commonName })
    })
  )
  certificate.subject.typesAndValues.push(
    new AttributeTypeAndValue({
      type: '2.5.4.6', // Country name
      value: new asn1js.PrintableString({ value: countryName })
    })
  )
  certificate.subject.typesAndValues.push(
    new AttributeTypeAndValue({
      type: '2.5.4.3', // Common name
      value: new asn1js.PrintableString({ value: commonName })
    })
  )
  const keyPair = await generateKeyPair({ signAlg, hashAlg })
  await certificate.subjectPublicKeyInfo.importKey(keyPair.publicKey)
  await certificate.sign(keyPair.privateKey, hashAlg)
  return { certificate, ...keyPair }
}

function getCAKeyUsage() {
  const bitArray = new ArrayBuffer(1)
  const bitView = new Uint8Array(bitArray)

  bitView[0] |= 0x02 // Key usage 'cRLSign' flag
  bitView[0] |= 0x04 // Key usage 'keyCertSign' flag

  return new asn1js.BitString({ valueHex: bitArray })
}

async function dumpCertificate({ certificate, privateKey }) {
  dumpPEM('CERTIFICATE', certificate.toSchema(true).toBER(false), 'files/root_ca.pem')
  dumpPEM('PRIVATE KEY', await getCrypto().exportKey('pkcs8', privateKey), 'files/root_key.pem')
}

main()
