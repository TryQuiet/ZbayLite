import { signing } from './tests/sign'
import { extractPubKey } from './tests/extractPubKey'
import { verificationSignature } from './tests/verification'

import { createRootCA } from './generatePems/generateRootCA'
import { createUserCsr } from './generatePems/requestCertificate'
import { createUserCert } from './generatePems/generateUserCertificate'
import { verifyUserCert } from './generatePems/verifyUserCertificate'

const createPem = async ({ rootCert, userCert }) => {
  const rootData = {
    communityName: 'community name'
  }

  const userData = {
    zbayNickanem: 'dev99damian',
    commonName: 'nqnw4kc4c77fb47lk52m5l57h4tcxceo7ymxekfn7yh5m66t4jv2olad',
    peerId: 'Qmf3ySkYqLET9xtAtDzvAr5Pp3egK1H3C5iJAZm1SpLEp6'
  }

  await createRootCA(rootData.communityName)
  await createUserCsr(userData.zbayNickanem, userData.commonName, userData.peerId)
  await createUserCert()
  await verifyUserCert(rootCert, userCert)
}

export const test = async (message) => {
  const pemDataSrc = {
    rootCert: `${process.cwd()}/files/root_ca.pem`,
    rootKey: `${process.cwd()}/files/root_key.pem`,
    userCert: `${process.cwd()}/files/user_cert.pem`,
    userPrivKey: `${process.cwd()}/files/user_key.pem`
  }

  await createPem(pemDataSrc)

  const data = {
    message: message,
    userPubKey: await extractPubKey(pemDataSrc.userCert),
    signature: await signing(message, pemDataSrc.userPrivKey)
  }
  console.log('\n DATA MESSAGE: \n', data)

  const verificationResult = await verificationSignature(data.userPubKey, data.signature, data.message)
  console.log('\n VERIFICATION MESSAGE: \n', verificationResult)
}

void test('hejoo')
