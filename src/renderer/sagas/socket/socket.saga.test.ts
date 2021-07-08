import { expectSaga } from 'redux-saga-test-plan'
import { combineReducers } from 'redux'
import { addCertificate } from './socket.saga'
import { StoreKeys } from '../../store/store.keys'
import { Store } from '../../store/reducers'
import { certificatesActions, certificatesReducer, CertificatesState } from '../../store/certificates/certificates.reducer'
import identity, { Identity } from '../../store/handlers/identity'

describe('checkCertificatesSaga', () => {
  const identityState = {
    ...new Identity()
  }

  const expectedState: Partial<Store> = {
    certificates: {
      ...new CertificatesState(),
      ownCertificate: {
        certificate: '',
        privateKey: ''
      }
    },
    identity: {
      ...identityState,
      registrationStatus: {
        nickname: 'nickname',
        status: '',
        takenUsernames: ['']
      }
    }
  }

  test('add certificate', async () => {
    await expectSaga(addCertificate)
      .withReducer(combineReducers({
        [StoreKeys.Certificates]: certificatesReducer,
        [StoreKeys.Identity]: identity.reducer
      }),
      {
        [StoreKeys.Certificates]: {
          ...new CertificatesState(),
          ownCertificate: {
            certificate: '',
            privateKey: ''
          }
        },
        [StoreKeys.Identity]: {
          ...new Identity(),
          registrationStatus: {
            nickname: 'nickname',
            status: '',
            takenUsernames: ['']
          }
        }
      })
      .put(certificatesActions.creactOwnCertificate('nickname'))
      .hasFinalState(expectedState)
      .run()
  })
})
