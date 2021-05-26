const atob = require('atob');
const asn1js = require('asn1js');
const fs = require('fs');
const pkijs = require('pkijs');
const pvutils = require('pvutils')

const { convertPemToBinary, printCertificate } = require('./convertPemToBinary')
const { envelopedEncrypt } = require('./encryption')



const main = async () => {
  const user1 = {
    reciversCertificate: fs.readFileSync(`${process.cwd()}/files/user_cert.pem`, 'utf8'),
    message: 'siema'
  }

  const user2 = {
    reciversCertificate: fs.readFileSync(`${process.cwd()}/files/user_cert.pem`, 'utf8'),
    message: 'hejo'
  }

  //convertPemToBinary(user1.reciversCertificate) // juz nie potrzebne

  // -- szyfrowanie na podstawie public key z certyfikatu (docelowo z certyfikatu recivera wiadomosci)
  const enc = await envelopedEncrypt(user1.reciversCertificate, user1.message)

  console.log('return', enc)
}

main()


