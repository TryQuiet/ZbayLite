import { IChannelInfo, IMessage } from '@zbayapp/nectar'
import { Community } from '@zbayapp/nectar/lib/sagas/communities/communities.slice'
import { Identity } from '@zbayapp/nectar/lib/sagas/identity/identity.slice'
import { publicChannelsAdapter } from '@zbayapp/nectar/lib/sagas/publicChannels/publicChannels.adapter'
import { CommunityChannels } from '@zbayapp/nectar/lib/sagas/publicChannels/publicChannels.slice'

export type socketEventData<T extends unknown[]> = [...T]

export const communityId = 'communityId'

export const community: Community = {
  id: communityId,
  name: 'name',
  CA: {
    rootCertString:
      'MIIBTDCB8wIBATAKBggqhkjOPQQDAjASMRAwDgYDVQQDEwdaYmF5IENBMB4XDTEwMTIyODEwMTAxMFoXDTMwMTIyODEwMTAxMFowEjEQMA4GA1UEAxMHWmJheSBDQTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJWQkmtUzYuTVkEaNcA+37kGTevnCM3cxbPNTl7bpOhNBUWCcyfw4Mz//BvbRaQUM9YzXf37vSdZ0Ny7jx5io0mjPzA9MA8GA1UdEwQIMAYBAf8CAQMwCwYDVR0PBAQDAgCGMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDATAKBggqhkjOPQQDAgNIADBFAiEA05xsJ8fNTwP7T6EVDROAGpC9Z4iPlRTjlURE28D1iWoCIGT2nXMZGw9bG2ckeunoHRs0Olp5+Ike6hDPCl2jLe7P',
    rootKeyString:
      'MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgZ3Nr6bD5eAD4+1KGNSr7HvswiPt5u9eq78vyH2L09DKgCgYIKoZIzj0DAQehRANCAASVkJJrVM2Lk1ZBGjXAPt+5Bk3r5wjN3MWzzU5e26ToTQVFgnMn8ODM//wb20WkFDPWM139+70nWdDcu48eYqNJ'
  },
  peerList: [],
  rootCa: '',
  registrarUrl: 'ugmx77q2tnm5fliyfxfeen5hsuzjtbsz44tsldui2ju7vl5xj4d447yd:7909',
  registrar: {
    privateKey: '',
    address: ''
  },
  privateKey: '',
  onionAddress: '',
  port: 0
}

export const generalChannel: IChannelInfo = {
  name: 'general',
  description: 'description',
  owner: 'holmes',
  timestamp: 1636971603355,
  address: 'general'
}

export const message1: IMessage = {
  id: '2ngd7u9qvdf',
  type: 1,
  message: 'Hello',
  createdAt: 1637326559.466,
  channelId: generalChannel.address,
  signature: 'signature',
  pubKey:
    'CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCY2r7s5YlgWXlHuHH4PY/cUik/m7GuWPdTPmmm4QZTr1VSyKgC2AMR45xrcGMjd5SDh1HjzbptJpYfGWO+Sbm6yK7EfxYN8gOXrbo0koKtPH0hrgzus+CqUCAQDE6XWzY5yP7caFt/RolZaBYNcKCWDCHv+bg/87u3MGwwSeaMjYWNAQ5IVWrUFnns8eiyNRhBGrEQZDTyO4X0oMeEkTTABMEJIpge91SWfuYuqltiNdkS9aiYS58F43IBHKKWLc39b3KbiykiG2IjrqVl2aAyb6vSgtiGkwi301jtWEctaDl2JbwZpgldOA83wH2aBPK9N9MaakEYdI2dHVSg8bf9AgMBAAE='
}

export const message2: IMessage = {
  id: 'gcydqq524w8',
  type: 1,
  message: 'Whats up',
  createdAt: 1637327681.67,
  channelId: generalChannel.address,
  signature: 'signature',
  pubKey:
    'CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCY2r7s5YlgWXlHuHH4PY/cUik/m7GuWPdTPmmm4QZTr1VSyKgC2AMR45xrcGMjd5SDh1HjzbptJpYfGWO+Sbm6yK7EfxYN8gOXrbo0koKtPH0hrgzus+CqUCAQDE6XWzY5yP7caFt/RolZaBYNcKCWDCHv+bg/87u3MGwwSeaMjYWNAQ5IVWrUFnns8eiyNRhBGrEQZDTyO4X0oMeEkTTABMEJIpge91SWfuYuqltiNdkS9aiYS58F43IBHKKWLc39b3KbiykiG2IjrqVl2aAyb6vSgtiGkwi301jtWEctaDl2JbwZpgldOA83wH2aBPK9N9MaakEYdI2dHVSg8bf9AgMBAAE='
}

export const communityChannels = new CommunityChannels(communityId)
communityChannels.currentChannel = 'general'
communityChannels.channels = publicChannelsAdapter.setAll(publicChannelsAdapter.getInitialState(), [
  generalChannel
])
communityChannels.channelMessages = {
  [generalChannel.address]: {
    ids: [message1.id],
    messages: {
      [message1.id]: message1
    }
  }
}

export const createIdentity = (id: string = communityId): Identity => ({
  id: id,
  zbayNickname: 'holmes',
  userCsr: {
    userCsr:
      'MIIBvjCCAWQCAQAwSTFHMEUGA1UEAxM+cHV0bnhpd3V0YmxnbGRlNWkybWN6cG8zN2g1bjRkdm9xa3FnMm1reHpvdjdyaXdxdTJvd2lhaWQub25pb24wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAR4pvUoI3LzmM1AypEhgYDCVFzJiTbALXMVGGAssU/tIBm9GgxM4aZUTXWL6qoa0wJy4tfL+APIxrXgoQL0A6ZCoIG4MC4GCSqGSIb3DQEJDjEhMB8wHQYDVR0OBBYEFNazUaLY28l23ZCdHqKXOrCBQYEtMC8GCSqGSIb3DQEJDDEiBCCfAW3vy+SIKdsWPoayjvsQMY+vOxCRcxBePcAk6VG7GzAWBgorBgEEAYOMGwIBMQgTBndpa3RvcjA9BgkrBgECAQ8DAQExMBMuUW1XVk1hVXFFQjczZ3pnR2tjOXdTN3JuaE5jcFN5SDY0ZG1iR1VkVTJUTTNlVjAKBggqhkjOPQQDAgNIADBFAiEA+LRH3J6V7uRBcTlO8oF99ThsvS7Hn+AdLSNkcjQgZEcCIBrMJiVlCFVHDk6wcqPSvgEeJTJ6zH/XEHxv7BQsEqNO',
    userKey:
      'MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgopKEkFSYjipo2ugfQ+Hr8q1dBWtZLRJY2dzyDwpGVBWgCgYIKoZIzj0DAQehRANCAAR4pvUoI3LzmM1AypEhgYDCVFzJiTbALXMVGGAssU/tIBm9GgxM4aZUTXWL6qoa0wJy4tfL+APIxrXgoQL0A6ZC',
    pkcs10: {
      pkcs10: {
        tbs:
          '308201640201003049314730450603550403133E7075746E7869777574626C676C64653569326D637A706F333768356E3464766F716B7167326D6B787A6F76377269777175326F77696169642E6F6E696F6E3059301306072A8648CE3D020106082A8648CE3D0301070342000478A6F5282372F398CD40CA91218180C2545CC98936C02D731518602CB14FED2019BD1A0C4CE1A6544D758BEAAA1AD30272E2D7CBF803C8C6B5E0A102F403A642A081B8302E06092A864886F70D01090E3121301F301D0603551D0E04160414D6B351A2D8DBC976DD909D1EA2973AB08141812D302F06092A864886F70D01090C312204209F016DEFCBE48829DB163E86B28EFB10318FAF3B109173105E3DC024E951BB1B3016060A2B06010401838C1B02013108130677696B746F72303D06092B060102010F0301013130132E516D57564D61557145423733677A67476B6339775337726E684E63705379483634646D624755645532544D336556',
        version: 0,
        subject: {
          typesAndValues: [
            {
              type: '2.5.4.3',
              value: {
                blockName: 'PrintableString',
                blockLength: 0,
                error: '',
                warnings: [],
                valueBeforeDecode: '',
                idBlock: {
                  blockName: 'identificationBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isHexOnly: false,
                  valueHex: '',
                  tagClass: 1,
                  tagNumber: 19,
                  isConstructed: false
                },
                lenBlock: {
                  blockName: 'lengthBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isIndefiniteForm: false,
                  longFormUsed: false,
                  length: 62
                },
                valueBlock: {
                  blockName: 'SimpleStringValueBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isHexOnly: true,
                  valueHex:
                    '7075746E7869777574626C676C64653569326D637A706F333768356E3464766F716B7167326D6B787A6F76377269777175326F77696169642E6F6E696F6E',
                  value: 'putnxiwutblglde5i2mczpo37h5n4dvoqkqg2mkxzov7riwqu2owiaid.onion'
                }
              }
            }
          ]
        },
        subjectPublicKeyInfo: {
          kty: 'EC',
          crv: 'P-256',
          x: 'eKb1KCNy85jNQMqRIYGAwlRcyYk2wC1zFRhgLLFP7SA',
          y: 'Gb0aDEzhplRNdYvqqhrTAnLi18v4A8jGteChAvQDpkI'
        },
        signatureAlgorithm: {
          algorithmId: '1.2.840.10045.4.3.2'
        },
        signatureValue: {
          blockName: 'BIT STRING',
          blockLength: 0,
          error: '',
          warnings: [],
          valueBeforeDecode: '',
          idBlock: {
            blockName: 'identificationBlock',
            blockLength: 0,
            error: '',
            warnings: [],
            valueBeforeDecode: '',
            isHexOnly: false,
            valueHex: '',
            tagClass: 1,
            tagNumber: 3,
            isConstructed: false
          },
          lenBlock: {
            blockName: 'lengthBlock',
            blockLength: 0,
            error: '',
            warnings: [],
            valueBeforeDecode: '',
            isIndefiniteForm: false,
            longFormUsed: false,
            length: 72
          },
          valueBlock: {
            blockName: 'BitStringValueBlock',
            blockLength: 71,
            error: '',
            warnings: [],
            valueBeforeDecode: '',
            isIndefiniteForm: false,
            value: [],
            isHexOnly: false,
            valueHex:
              '3045022100F8B447DC9E95EEE44171394EF2817DF5386CBD2EC79FE01D2D2364723420644702201ACC2625650855470E4EB072A3D2BE011E25327ACC7FD7107C6FEC142C12A34E',
            unusedBits: 0,
            isConstructed: false
          }
        },
        attributes: [
          {
            type: '1.2.840.113549.1.9.14',
            values: [
              {
                blockName: 'SEQUENCE',
                blockLength: 0,
                error: '',
                warnings: [],
                valueBeforeDecode: '',
                idBlock: {
                  blockName: 'identificationBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isHexOnly: false,
                  valueHex: '',
                  tagClass: 1,
                  tagNumber: 16,
                  isConstructed: true
                },
                lenBlock: {
                  blockName: 'lengthBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isIndefiniteForm: false,
                  longFormUsed: false,
                  length: 31
                },
                valueBlock: {
                  blockName: 'ConstructedValueBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isIndefiniteForm: false,
                  value: [
                    {
                      blockName: 'SEQUENCE',
                      blockLength: 0,
                      error: '',
                      warnings: [],
                      valueBeforeDecode: '',
                      idBlock: {
                        blockName: 'identificationBlock',
                        blockLength: 0,
                        error: '',
                        warnings: [],
                        valueBeforeDecode: '',
                        isHexOnly: false,
                        valueHex: '',
                        tagClass: 1,
                        tagNumber: 16,
                        isConstructed: true
                      },
                      lenBlock: {
                        blockName: 'lengthBlock',
                        blockLength: 0,
                        error: '',
                        warnings: [],
                        valueBeforeDecode: '',
                        isIndefiniteForm: false,
                        longFormUsed: false,
                        length: 29
                      },
                      valueBlock: {
                        blockName: 'ConstructedValueBlock',
                        blockLength: 0,
                        error: '',
                        warnings: [],
                        valueBeforeDecode: '',
                        isIndefiniteForm: false,
                        value: [
                          {
                            blockName: 'OBJECT IDENTIFIER',
                            blockLength: 0,
                            error: '',
                            warnings: [],
                            valueBeforeDecode: '',
                            idBlock: {
                              blockName: 'identificationBlock',
                              blockLength: 0,
                              error: '',
                              warnings: [],
                              valueBeforeDecode: '',
                              isHexOnly: false,
                              valueHex: '',
                              tagClass: 1,
                              tagNumber: 6,
                              isConstructed: false
                            },
                            lenBlock: {
                              blockName: 'lengthBlock',
                              blockLength: 0,
                              error: '',
                              warnings: [],
                              valueBeforeDecode: '',
                              isIndefiniteForm: false,
                              longFormUsed: false,
                              length: 3
                            },
                            valueBlock: {
                              blockName: 'ObjectIdentifierValueBlock',
                              blockLength: 0,
                              error: '',
                              warnings: [],
                              valueBeforeDecode: '',
                              value: '2.5.29.14',
                              sidArray: [
                                {
                                  blockName: 'sidBlock',
                                  blockLength: 0,
                                  error: '',
                                  warnings: [],
                                  valueBeforeDecode: '',
                                  isHexOnly: false,
                                  valueHex: '',
                                  valueDec: 85,
                                  isFirstSid: true
                                },
                                {
                                  blockName: 'sidBlock',
                                  blockLength: 0,
                                  error: '',
                                  warnings: [],
                                  valueBeforeDecode: '',
                                  isHexOnly: false,
                                  valueHex: '',
                                  valueDec: 29,
                                  isFirstSid: false
                                },
                                {
                                  blockName: 'sidBlock',
                                  blockLength: 0,
                                  error: '',
                                  warnings: [],
                                  valueBeforeDecode: '',
                                  isHexOnly: false,
                                  valueHex: '',
                                  valueDec: 14,
                                  isFirstSid: false
                                }
                              ]
                            }
                          },
                          {
                            blockName: 'OCTET STRING',
                            blockLength: 0,
                            error: '',
                            warnings: [],
                            valueBeforeDecode: '',
                            idBlock: {
                              blockName: 'identificationBlock',
                              blockLength: 0,
                              error: '',
                              warnings: [],
                              valueBeforeDecode: '',
                              isHexOnly: false,
                              valueHex: '',
                              tagClass: 1,
                              tagNumber: 4,
                              isConstructed: false
                            },
                            lenBlock: {
                              blockName: 'lengthBlock',
                              blockLength: 0,
                              error: '',
                              warnings: [],
                              valueBeforeDecode: '',
                              isIndefiniteForm: false,
                              longFormUsed: false,
                              length: 22
                            },
                            valueBlock: {
                              blockName: 'OctetStringValueBlock',
                              blockLength: 0,
                              error: '',
                              warnings: [],
                              valueBeforeDecode: '',
                              isIndefiniteForm: false,
                              value: [],
                              isHexOnly: false,
                              valueHex: '0414D6B351A2D8DBC976DD909D1EA2973AB08141812D',
                              isConstructed: false
                            }
                          }
                        ]
                      }
                    }
                  ]
                }
              }
            ]
          },
          {
            type: '1.2.840.113549.1.9.12',
            values: [
              {
                blockName: 'OCTET STRING',
                blockLength: 0,
                error: '',
                warnings: [],
                valueBeforeDecode: '',
                idBlock: {
                  blockName: 'identificationBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isHexOnly: false,
                  valueHex: '',
                  tagClass: 1,
                  tagNumber: 4,
                  isConstructed: false
                },
                lenBlock: {
                  blockName: 'lengthBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isIndefiniteForm: false,
                  longFormUsed: false,
                  length: 32
                },
                valueBlock: {
                  blockName: 'OctetStringValueBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isIndefiniteForm: false,
                  value: [],
                  isHexOnly: false,
                  valueHex: '9F016DEFCBE48829DB163E86B28EFB10318FAF3B109173105E3DC024E951BB1B',
                  isConstructed: false
                }
              }
            ]
          },
          {
            type: '1.3.6.1.4.1.50715.2.1',
            values: [
              {
                blockName: 'PrintableString',
                blockLength: 0,
                error: '',
                warnings: [],
                valueBeforeDecode: '',
                idBlock: {
                  blockName: 'identificationBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isHexOnly: false,
                  valueHex: '',
                  tagClass: 1,
                  tagNumber: 19,
                  isConstructed: false
                },
                lenBlock: {
                  blockName: 'lengthBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isIndefiniteForm: false,
                  longFormUsed: false,
                  length: 6
                },
                valueBlock: {
                  blockName: 'SimpleStringValueBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isHexOnly: true,
                  valueHex: '77696B746F72',
                  value: 'wiktor'
                }
              }
            ]
          },
          {
            type: '1.3.6.1.2.1.15.3.1.1',
            values: [
              {
                blockName: 'PrintableString',
                blockLength: 0,
                error: '',
                warnings: [],
                valueBeforeDecode: '',
                idBlock: {
                  blockName: 'identificationBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isHexOnly: false,
                  valueHex: '',
                  tagClass: 1,
                  tagNumber: 19,
                  isConstructed: false
                },
                lenBlock: {
                  blockName: 'lengthBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isIndefiniteForm: false,
                  longFormUsed: false,
                  length: 46
                },
                valueBlock: {
                  blockName: 'SimpleStringValueBlock',
                  blockLength: 0,
                  error: '',
                  warnings: [],
                  valueBeforeDecode: '',
                  isHexOnly: true,
                  valueHex:
                    '516D57564D61557145423733677A67476B6339775337726E684E63705379483634646D624755645532544D336556',
                  value: 'QmWVMaUqEB73gzgGkc9wS7rnhNcpSyH64dmbGUdU2TM3eV'
                }
              }
            ]
          }
        ]
      },
      publicKey: {},
      privateKey: {}
    }
  },
  userCertificate:
    'MIICDjCCAbMCBgF9NBTJyjAKBggqhkjOPQQDAjASMRAwDgYDVQQDEwdaYmF5IENBMB4XDTIxMTExODE3MjUxN1oXDTMwMDEzMTIzMDAwMFowSTFHMEUGA1UEAxM+cHV0bnhpd3V0YmxnbGRlNWkybWN6cG8zN2g1bjRkdm9xa3FnMm1reHpvdjdyaXdxdTJvd2lhaWQub25pb24wWTATBgcqhkjOPQIBBggqhkjOPQMBBwNCAAR4pvUoI3LzmM1AypEhgYDCVFzJiTbALXMVGGAssU/tIBm9GgxM4aZUTXWL6qoa0wJy4tfL+APIxrXgoQL0A6ZCo4HCMIG/MAkGA1UdEwQCMAAwCwYDVR0PBAQDAgCOMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDATAvBgkqhkiG9w0BCQwEIgQgnwFt78vkiCnbFj6Gso77EDGPrzsQkXMQXj3AJOlRuxswFgYKKwYBBAGDjBsCAQQIEwZ3aWt0b3IwPQYJKwYBAgEPAwEBBDATLlFtV1ZNYVVxRUI3M2d6Z0drYzl3UzdybmhOY3BTeUg2NGRtYkdVZFUyVE0zZVYwCgYIKoZIzj0EAwIDSQAwRgIhAJypKvUCmMX0xMQVH02DbYNtNdzP/RmrSEVVEEgeZj4vAiEA9PC68Z5kA7dXZbc4BM3zOmMVE3H+D/gUTh5J85erYig=',
  peerId: {
    id: 'QmWVMaUqEB73gzgGkc9wS7rnhNcpSyH64dmbGUdU2TM3eV',
    privKey:
      'CAASqAkwggSkAgEAAoIBAQCY2r7s5YlgWXlHuHH4PY/cUik/m7GuWPdTPmmm4QZTr1VSyKgC2AMR45xrcGMjd5SDh1HjzbptJpYfGWO+Sbm6yK7EfxYN8gOXrbo0koKtPH0hrgzus+CqUCAQDE6XWzY5yP7caFt/RolZaBYNcKCWDCHv+bg/87u3MGwwSeaMjYWNAQ5IVWrUFnns8eiyNRhBGrEQZDTyO4X0oMeEkTTABMEJIpge91SWfuYuqltiNdkS9aiYS58F43IBHKKWLc39b3KbiykiG2IjrqVl2aAyb6vSgtiGkwi301jtWEctaDl2JbwZpgldOA83wH2aBPK9N9MaakEYdI2dHVSg8bf9AgMBAAECggEAOH8JeIfyecE4WXDr9wPSC232vwLt7nIFoCf+ZubfLskscTenGb37jH4jT3avvekx5Fd8xgVBNZzAeegpfKjFVCtepVQPs8HS4BofK9VHJX6pBWzObN/hVzHcV/Ikjj7xUPRgdti/kNBibcBR/k+1myAK3ybemgydQj1Mj6CQ7Tu/4npaRXhVygasbTgFCYxrV+CGjzITdCAdRTWg1+H6puxjfObZqj0wa4I6sCom0+Eau7nULtVmi0hodOwKwtmc2oaUyCQY2yiEjdZnkXEEhP1EtJka+kD96iAG3YvFqlcdUPYVlIxCP9h55AaOShnACNymiTpYzpCP/kUK9wFkZQKBgQD2wjjWEmg8DzkD3y19MVZ71w0kt0PgZMU+alR8EZCJGqvoyi2wcinfdmqyOZBf2rct+3IyVpwuWPjsHOHq7ZaJGmJkTGrNbndTQ+WgwJDvghqBfHFrgBQNXvqHl5EuqnRMCjrJeP8Uud1su5zJbHQGsycZwPzB3fSj0yAyRO812wKBgQCelDmknQFCkgwIFwqqdClUyeOhC03PY0RGngp+sLlu8Q8iyEI1E9i/jTkjPpioAZ/ub5iD6iP5gj27N239B/elZY5xQQeDA4Ns+4yNOTx+nYXmWcTfVINFVe5AK824TjqlCY2ES+/hVBKB+JQV6ILlcCj5dXz9cCbg6cys4TttBwKBgH+rdaSs2WlZpvIt4mdHw6tHVPGOMHxFJxhoA1Y98D4/onpLQOBt8ORBbGrSBbTSgLw1wJvy29PPDNt9BhZ63swI7qdeMlQft3VJR+GoQFTrR7N/I1+vYLCaV50X+nHel1VQZaIgDDo5ACtl1nUQu+dLggt9IklcAVtRvPLFX87JAoGBAIBl8+ZdWc/VAPjr7y7krzJ/5VdYF8B716R2AnliDkLN3DuFelYPo8g1SLZI0MH3zs74fL0Sr94unl0gHGZsNRAuko8Q4EwsZBWx97PBTEIYuXox5T4O59sUILzEuuUoMkO+4F7mPWxs7i9eXkj+4j1z+zlA79slG9WweJDiLYOxAoGBAMmH/nv1+0sUIL2qgE7OBs8kokUwx4P8ZRAlL6ZVC4tVuDBL0zbjJKcQWOcpWQs9pC6O/hgPur3VgHDF7gko3ZDB0KuxVJPZyIhoo+PqXaCeq4KuIPESjYKT803p2S76n/c2kUaQ5i2lYToClvhk72kw9o9niSyVdotXxC90abI9',
    pubKey:
      'CAASpgIwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCY2r7s5YlgWXlHuHH4PY/cUik/m7GuWPdTPmmm4QZTr1VSyKgC2AMR45xrcGMjd5SDh1HjzbptJpYfGWO+Sbm6yK7EfxYN8gOXrbo0koKtPH0hrgzus+CqUCAQDE6XWzY5yP7caFt/RolZaBYNcKCWDCHv+bg/87u3MGwwSeaMjYWNAQ5IVWrUFnns8eiyNRhBGrEQZDTyO4X0oMeEkTTABMEJIpge91SWfuYuqltiNdkS9aiYS58F43IBHKKWLc39b3KbiykiG2IjrqVl2aAyb6vSgtiGkwi301jtWEctaDl2JbwZpgldOA83wH2aBPK9N9MaakEYdI2dHVSg8bf9AgMBAAE='
  },
  hiddenService: {
    onionAddress: 'putnxiwutblglde5i2mczpo37h5n4dvoqkqg2mkxzov7riwqu2owiaid.onion',
    privateKey:
      'ED25519-V3:WND1FoFZyY+c1f0uD6FBWgKvSYl4CdKSizSR7djRekW/rqw5fTw+gN80sGk0gl01sL5i25noliw85zF1BUBRDQ=='
  },
  dmKeys: {
    publicKey: '9f016defcbe48829db163e86b28efb10318faf3b109173105e3dc024e951bb1b',
    privateKey: '4dcebbf395c0e9415bc47e52c96fcfaf4bd2485a516f45118c2477036b45fc0b'
  }
})
