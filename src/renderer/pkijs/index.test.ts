import { Time } from 'pkijs'

import { signing } from './tests/sign'
import { extractPubKey } from './tests/extractPubKey'
import { verifySignature } from './tests/verification'
import { createRootCA } from './generatePems/generateRootCA'
import { createUserCsr } from './generatePems/requestCertificate'
import { createUserCert } from './generatePems/generateUserCertificate'

export const test = async (message) => {
  const userData = {
    zbayNickanem: 'dev99damian',
    commonName: 'nqnw4kc4c77fb47lk52m5l57h4tcxceo7ymxekfn7yh5m66t4jv2olad.onion',
    peerId: 'Qmf3ySkYqLET9xtAtDzvAr5Pp3egK1H3C5iJAZm1SpLEp6'
  }
  const notBeforeDate = new Date()
  const notAfterDate = new Date(2030, 1, 1)

  const rootCert = await createRootCA(new Time({ type: 1, value: notBeforeDate }), new Time({ type: 1, value: notAfterDate }))
  const user = await createUserCsr(userData)
  const userCert = await createUserCert(rootCert.rootCertString, rootCert.rootKeyString, user.userCsr, notBeforeDate, notAfterDate)
  // console.log(await verifyUserCert(rootCert.rootCertString, userCert.userCertString))

  const data = {
    message: message,
    userPubKey: await extractPubKey(userCert.userCertString),
    signature: await signing(message, user.pkcs10.privateKey)
  }
  console.log('\n DATA MESSAGE: \n', data)

  return await verifySignature(data.userPubKey, data.signature, data.message)
}

describe('verify sign', () => {
  it('verification test', async () => {
    const result = await test('Hellow')
    expect(result).toBe(true)
  })
})
