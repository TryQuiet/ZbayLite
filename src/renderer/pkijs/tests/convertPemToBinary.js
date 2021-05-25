/* global require Buffer module */

const atob = require('atob');
const asn1js = require('asn1js');
const fs = require('fs');
const pkijs = require('pkijs');
const pvutils = require('pvutils')



// -- convert certyfikatu na buffer
function convertPemToBinary(pem) {
  var lines = pem.split('\n');
  var encoded = '';
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim().length > 0 &&
      lines[i].indexOf('-BEGIN RSA PRIVATE KEY-') < 0 &&
      lines[i].indexOf('-BEGIN RSA PUBLIC KEY-') < 0 &&
      lines[i].indexOf('-BEGIN PUBLIC KEY-') < 0 &&
      lines[i].indexOf('-BEGIN CERTIFICATE-') < 0 &&
      lines[i].indexOf('-BEGIN PRIVATE KEY-') < 0 &&
      lines[i].indexOf('-END PRIVATE KEY-') < 0 &&
      lines[i].indexOf('-END CERTIFICATE-') < 0 &&
      lines[i].indexOf('-END PUBLIC KEY-') < 0 &&
      lines[i].indexOf('-END RSA PRIVATE KEY-') < 0 &&
      lines[i].indexOf('-END RSA PUBLIC KEY-') < 0) {
      encoded += lines[i].trim();
    }
  }
  return base64StringToArrayBuffer(encoded);
}

function base64StringToArrayBuffer(b64str) {
  let byteStr = atob(b64str);
  let bytes = new Uint8Array(byteStr.length);
  for (let i = 0; i < byteStr.length; i++) {
    bytes[i] = byteStr.charCodeAt(i);
  }
  return bytes.buffer;
}



// -- wyświetenie
function printCertificate(certificateBuffer) {
  let asn1 = asn1js.fromBER(certificateBuffer);
  if (asn1.offset === (-1)) {
    console.log("Can not parse binary data");
  }
  const certificate = new Certificate({ schema: asn1.result });
  console.log(certificate);
  console.log('Certificate Serial Number');
  console.log(pvutils.bufferToHexCodes(certificate.serialNumber.valueBlock.valueHex));
  console.log('Certificate Issuance');
  console.log(certificate.notBefore.value.toString());
  console.log('Certificate Expiry');
  console.log(certificate.notAfter.value.toString());
  console.log(certificate.issuer);
}



module.exports = {
  printCertificate,
  convertPemToBinary
}
