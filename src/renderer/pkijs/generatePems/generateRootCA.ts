import { Integer, PrintableString, BitString } from 'asn1js'
import { Certificate, AttributeTypeAndValue, BasicConstraints, Extension, Time, getCrypto } from 'pkijs'

import { signAlg, hashAlg } from './config'
import { generateKeyPair, CertFieldsTypes } from './common'

export const createRootCA = async () => {
  const rootCA = await generateRootCA({
    commonName: `Zbay CA`,
    signAlg,
    hashAlg
  })
  // await dumpCertificate(rootCA)

  const rootData = {
    rootCert: rootCA.certificate.toSchema(true).toBER(false),
    rootKey: await getCrypto().exportKey('pkcs8', rootCA.privateKey)
  }

  return {
    rootCert: Buffer.from(rootData.rootCert).toString('base64'),
    rootKey: Buffer.from(rootData.rootKey).toString('base64')
  }
}

async function generateRootCA({ commonName, signAlg, hashAlg }) {
  const basicConstr = new BasicConstraints({ cA: true, pathLenConstraint: 3 })
  const keyUsage = getCAKeyUsage()
  const certificate = new Certificate({
    serialNumber: new Integer({ value: 1 }),
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
    notAfter: new Time({ type: 1, value: new Date(2022, 1, 1) })
  })
  certificate.issuer.typesAndValues.push(
    new AttributeTypeAndValue({
      type: CertFieldsTypes.commonName,
      value: new PrintableString({ value: commonName })
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

  return new BitString({ valueHex: bitArray })
}

// async function dumpCertificate({ certificate, privateKey }) {
//   dumpPEM('CERTIFICATE', certificate.toSchema(true).toBER(false), 'files/root_ca.pem')
//   dumpPEM('PRIVATE KEY', await getCrypto().exportKey('pkcs8', privateKey), 'files/root_key.pem')
// }
