const atob = require('atob');
const asn1js = require('asn1js');
const fs = require('fs');
const pkijs = require('pkijs');
const pvutils = require('pvutils')

const { convertPemToBinary, printCertificate } = require('./convertPemToBinary')
const { envelopedEncryptInternal } = require('./encryption')



const main = async () => {
  const data = {
    message: 'czesc :)'
  }

  // -- ładowanie certyfikatu i stworzenie z niego buffera
  let pemFile = fs.readFileSync(`${process.cwd()}/files/user_cert.pem`, 'utf8');
  const binaryPem = convertPemToBinary(pemFile)
  console.log(binaryPem)


  // -- szyfrowanie na podstawie pub key z certyfikatu (docelowo z certyfikatu recivera wiadomosci)
  const encrypted = envelopedEncryptInternal(binaryPem)

  console.log(encrypted)
}

main()


