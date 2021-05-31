import { PrintableString, OctetString } from 'asn1js'
import {
  CertificationRequest, AttributeTypeAndValue, Extension, Extensions,
  getCrypto, Attribute
} from 'pkijs'

import { signAlg, hashAlg } from './config'
import { generateKeyPair, dumpPEM } from './common'

export const createUserCsr = async (zbayNickanem, commonName, peerId) => {
  const pkcs10 = await requestCertificate({
    zbayNickanem: zbayNickanem,
    commonName: commonName,
    peerId: peerId,
    signAlg,
    hashAlg
  })
  await dumpCertificate(pkcs10)
}

async function requestCertificate({ zbayNickanem, commonName, peerId, signAlg, hashAlg }) {
  const keyPair = await generateKeyPair({ signAlg, hashAlg })
  const pkcs10 = new CertificationRequest({
    version: 0,
    attributes: []
  })
  pkcs10.subject.typesAndValues.push(
    new AttributeTypeAndValue({
      type: '2.5.4.3',
      value: new PrintableString({ value: zbayNickanem })
    })
  )
  pkcs10.subject.typesAndValues.push(
    new AttributeTypeAndValue({
      type: '2.5.4.3',
      value: new PrintableString({ value: commonName })
    })
  )
  pkcs10.subject.typesAndValues.push(
    new AttributeTypeAndValue({
      type: '2.5.4.3',
      value: new PrintableString({ value: peerId })
    })
  )
  await pkcs10.subjectPublicKeyInfo.importKey(keyPair.publicKey)
  const hashedPublicKey = await getCrypto().digest(
    { name: 'SHA-1' },
    pkcs10.subjectPublicKeyInfo.subjectPublicKey.valueBlock.valueHex)
  pkcs10.attributes.push(
    new Attribute({
      type: '1.2.840.113549.1.9.14', // pkcs-9-at-extensionRequest
      values: [
        (new Extensions({
          extensions: [
            new Extension({
              extnID: '2.5.29.14',
              critical: false,
              extnValue: (new OctetString({ valueHex: hashedPublicKey })).toBER(false)
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
