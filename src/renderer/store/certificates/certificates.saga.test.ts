import { expectSaga } from 'redux-saga-test-plan'
import { apply } from 'redux-saga/effects'

import { certificatesActions, certificatesReducer } from './certificates.reducer'
import { creactOwnCertificate } from './certificates.saga'
import { CertificatesState } from './certificates.reducer'
import { createUserCsr } from '../../pkijs/generatePems/requestCertificate'
import { createUserCert } from '../../pkijs/generatePems/generateUserCertificate'
import electronStore from '../../../shared/electronStore'

describe('checkCertificatesSaga', () => {

  test('creating own cert', () => {
    expectSaga(creactOwnCertificate, { payload: 'name', type: certificatesActions.creactOwnCertificate.type })
      .withReducer((certificatesReducer), {
        ...new CertificatesState()
      })
      .provide([
        [createUserCsr({ commonName: '', peerId: '', zbayNickname: '' }), {
          userCsr: '',
          userKey: 'certKey',
          pkcs10: {}
        }],
        [createUserCert('', '', {}, new Date(), new Date()), {
          userCertObject: {},
          userCertString: 'cert'
        }]
      ])
      .put(certificatesActions.setOwnCertificate('cert'))
      .put(certificatesActions.setOwnCertKey('certKey'))
      .put(certificatesActions.saveCertificate('cert'))
      .hasFinalState({
        ...new CertificatesState(),
        usersCertificates: ['certificate'],
        ownCertificate: {
          certificate: 'cert',
          privateKey: 'certKey'
        }
      })
      .run()
  })
})