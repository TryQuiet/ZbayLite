/* global require, Buffer */
const asn1js = require('asn1js')
const {
  Certificate, AttributeTypeAndValue, BasicConstraints, Extension,
  getAlgorithmParameters, getCrypto, setEngine, CryptoEngine } = require('pkijs')

const { signAlg, hashAlg } = require('./config')
const { generateKeyPair, dumpPEM, loadCertificate, loadPrivateKey, loadCSR } = require('./common')


async function main() {
  const rootCACert = 'files/root_ca.pem'
  const rootCAKey = 'files/root_key.pem'
  const csrFile = 'files/pkcs10.csr'

  const userCertificate = await generateuserCertificate({
    issuerCert: await loadCertificate(rootCACert),
    issuerKey: await loadPrivateKey(rootCAKey, signAlg, hashAlg),
    pkcs10: await loadCSR(csrFile),
    signAlg,
    hashAlg
  })
  await dumpCertificate(userCertificate)
}

async function generateuserCertificate({ issuerCert, issuerKey, pkcs10, signAlg, hashAlg }) {
  const basicConstr = new BasicConstraints({ cA: false, pathLenConstraint: 3 })
  const keyUsage = getKeyUsage()
  const certificate = new Certificate({
    serialNumber: new asn1js.Integer({ value: (new Date()).getTime() }),
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
    issuer: issuerCert.subject,
    subject: pkcs10.subject,
    subjectPublicKeyInfo: pkcs10.subjectPublicKeyInfo
  })
  certificate.notBefore.value = new Date()
  certificate.notAfter.value = new Date(2020, 1, 1)
  await certificate.sign(issuerKey, hashAlg)
  return { certificate }
}


function getKeyUsage() {
  const bitArray = new ArrayBuffer(1)
  const bitView = new Uint8Array(bitArray)

  bitView[0] |= 0x02 // Key usage 'cRLSign' flag
  bitView[0] |= 0x04 // Key usage 'keyCertSign' flag

  return new asn1js.BitString({ valueHex: bitArray })
}


async function dumpCertificate({ certificate, privateKey }) {
  dumpPEM('CERTIFICATE', certificate.toSchema(true).toBER(false), 'files/user_cert.pem')
}

main().then(() => null, console.error)
