import { Integer, BitString } from 'asn1js'
import { Certificate, BasicConstraints, Extension } from 'pkijs'

import config from './config'
import { loadCertificate, loadPrivateKey, loadCSR } from './common'
import { KeyObject } from 'node:crypto'

export const createUserCert = async (rootCA, rootKey, userCsr, notBeforeDate, notAfterDate) => {
  // const rootCACert = 'files/root_ca.pem'
  // const rootCAKey = 'files/root_key.pem'
  const { hashAlg, signAlg } = config
  const userCertificate = await generateuserCertificate({
    issuerCert: await loadCertificate(rootCA),
    issuerKey: await loadPrivateKey(rootKey, signAlg, hashAlg),
    pkcs10: await loadCSR(userCsr),
    hashAlg,
    notBeforeDate,
    notAfterDate
  })
  // await dumpCertificate(userCertificate)

  const userCert = userCertificate.certificate.toSchema(true).toBER(false)
  return Buffer.from(userCert).toString('base64')
}

async function generateuserCertificate({
  issuerCert,
  issuerKey,
  pkcs10,
  hashAlg = config.hashAlg,
  notBeforeDate,
  notAfterDate
}: { issuerCert: Certificate; issuerKey: KeyObject; pkcs10: Certificate; hashAlg: string; notBeforeDate: Date; notAfterDate: Date }): Promise<Certificate> {
  const basicConstr = new BasicConstraints({ cA: false, pathLenConstraint: 3 })
  const keyUsage = getKeyUsage()
  const certificate = new Certificate({
    serialNumber: new Integer({ value: (new Date()).getTime() }),
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
  certificate.notBefore.value = notBeforeDate
  certificate.notAfter.value = notAfterDate
  await certificate.sign(issuerKey, hashAlg)
  return { certificate }
}

function getKeyUsage() {
  const bitArray = new ArrayBuffer(1)
  const bitView = new Uint8Array(bitArray)

  bitView[0] |= 0x02 // Key usage 'cRLSign' flag
  bitView[0] |= 0x04 // Key usage 'keyCertSign' flag

  return new BitString({ valueHex: bitArray })
}

// async function dumpCertificate({ certificate }) {
//   dumpPEM('CERTIFICATE', certificate.toSchema(true).toBER(false), 'files/user_cert.pem')
// }
