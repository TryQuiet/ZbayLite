/* global require, Buffer */
const { CertificateChainValidationEngine } = require('pkijs')
const { loadCertificate } = require('./common')


async function main() {
  const rootCACert = 'files/root_ca.pem'
  const userCert = 'files/user_cert.pem'
  const trustedCerts = [await loadCertificate(rootCACert)]
  const certificates = [await loadCertificate(userCert)]
  const crls = []
  console.log(`Verifying ${userCert} using ${rootCACert} aaa`)
  const certChainVerificationEngine = new CertificateChainValidationEngine({
    trustedCerts,
    certs: certificates,
    crls
  })
  const result = await certChainVerificationEngine.verify()
  console.log(
    `Verification result:\n${Object.keys(result).map(key => ` ${key}: ${result[key]}`).join('\n')}`
  )
}

main()
