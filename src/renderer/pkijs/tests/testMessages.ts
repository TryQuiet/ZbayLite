
import fs from 'fs'
import pvutils from 'pvutils'
import pkijs from 'pkijs'
import asn1js from 'asn1js'

import { convertPemToBinary, printCertificate } from './convertPemToBinary'
import { envelopedEncrypt } from './encryption'
import { envelopedDecrypt } from './decryption'

const main = async () => {
  const user1 = {
    reciversCertificate: fs.readFileSync(`${process.cwd()}/files/user_cert.pem`, 'utf8'),
    reciverKey: fs.readFileSync(`${process.cwd()}/files/user_key.pem`, 'utf8'),
    message: 'siema'
  }

  //convertPemToBinary(user1.reciversCertificate) // juz nie potrzebne

  // -- szyfrowanie na podstawie public key z certyfikatu (docelowo z certyfikatu recivera wiadomosci)
  const enc = await envelopedEncrypt(user1.reciversCertificate, user1.message)
  console.log('\n encrypted message: \n', enc)

  envelopedDecrypt(user1.reciversCertificate, user1.reciverKey, enc)
}

main()


