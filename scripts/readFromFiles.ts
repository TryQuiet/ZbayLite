import fs from 'fs'

export const readRootCertFromFile = () => {
  const encodedCertificate = fs.readFileSync(`${process.cwd()}/files/root_ca.pem`).toString('utf-8')
  return encodedCertificate.replace(/(-----(BEGIN|END)( NEW)? CERTIFICATE-----|\n)/g, '')
}

export const readRootKeyFromFile = () => {
  const encodedKey = fs.readFileSync(`${process.cwd()}/files/root_key.pem`).toString('utf-8')
  return encodedKey.replace(/(-----(BEGIN|END)( NEW)? PRIVATE KEY-----|\n)/g, '')
}
