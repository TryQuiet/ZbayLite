/* global require, Buffer */
import { CertificateChainValidationEngine } from 'pkijs'

import { loadCertificate } from './common'

export const verifyUserCert = async (rootCACert, userCert) => {
  const trustedCerts = [await loadCertificate(rootCACert)]
  const certificates = [await loadCertificate(userCert)]
  const crls = []
  console.log(`Verifying ${userCert} using ${rootCACert}`)
  const certChainVerificationEngine = new CertificateChainValidationEngine({
    trustedCerts,
    certs: certificates,
    crls
  })
  const result = await certChainVerificationEngine.verify()
  console.log(result)
  console.log(
    `Verification result:\n${Object.keys(result).map(key => ` ${key}: ${result[key]}`).join('\n')}`
  )
}
