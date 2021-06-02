import { signing } from './tests/sign'
import { extractPubKey } from './tests/extractPubKey'
import { verificationSignature } from './tests/verification'

import { createRootCA } from './generatePems/generateRootCA'
import { createUserCsr } from './generatePems/requestCertificate'
import { createUserCert } from './generatePems/generateUserCertificate'
import { verifyUserCert } from './generatePems/verifyUserCertificate'

export const test = async (message) => {
  const userData = {
    zbayNickanem: 'dev99damian',
    commonName: 'nqnw4kc4c77fb47lk52m5l57h4tcxceo7ymxekfn7yh5m66t4jv2olad.onion',
    peerId: 'Qmf3ySkYqLET9xtAtDzvAr5Pp3egK1H3C5iJAZm1SpLEp6'
  }

  const root = await createRootCA()
  const user = await createUserCsr(userData.zbayNickanem, userData.commonName, userData.peerId)

  const userCert = await createUserCert(root.rootCert, root.rootKey, user.userCsr)

  // await verifyUserCert(pemDataBuffers.rootCert, pemDataBuffers.userCert)

  const data = {
    message: message,
    userPubKey: await extractPubKey(userCert),
    signature: await signing(message, user.pkcs10.privateKey)
  }
  console.log('\n DATA MESSAGE: \n', data)

  return await verificationSignature(data.userPubKey, data.signature, data.message)
}

describe('verify sign', () => {
  it('verification test', async () => {
    const result = await test('Hellow')
    expect(result).toBe(true)
  })
})
