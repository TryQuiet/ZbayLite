/* global require, Buffer */
const find = require('lodash.find')
const { loadCertificate, loadCMS } = require('./common')

async function main() {
  const rootCACert = 'files/root_ca.pem'
  const cmsFile = 'files/cms.pem'
  const trustedCertificates = [await loadCertificate(rootCACert)]
  const signedData = await loadCMS(cmsFile)
  const crls = []
  console.log(`Verifying CMS message ${cmsFile} using ${rootCACert}`)

  const verificationParameters = {
    signer: 0,
    trustedCerts: trustedCertificates
  };

  const result = await signedData.verify(verificationParameters)
  console.log(`Verification result: ${result}`)
  const signerCN = find(
    signedData.certificates[0].subject.typesAndValues,
    ({ type }) => type === '2.5.4.3'
  ).value.valueBlock.value
  const signerDoB = find(
    signedData.certificates[0].subject.typesAndValues,
    ({ type }) => type === '1.3.6.1.5.5.7.9.1'
  ).value
  const signingTime = find(
    signedData.signerInfos[0].signedAttrs.attributes,
    ({ type }) => type === '1.2.840.113549.1.9.5'
  ).values[0]
  console.log(`Signer CN=${signerCN}`)
  console.log(`Signer DoB=${signerDoB.toDate()}`)
  console.log(`Signer age=${calculateAge(signerDoB.toDate(), signingTime.toDate())}`)
  console.log(`Signing time=${signingTime.toDate()}`)
}

function calculateAge(dateOfBirth, now) { // birthday is a date
  const ageDifMs = now - dateOfBirth.getTime()
  const ageDate = new Date(ageDifMs); // miliseconds from epoch
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

main()
