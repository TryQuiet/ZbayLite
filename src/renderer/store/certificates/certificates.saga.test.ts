import { expectSaga } from 'redux-saga-test-plan'

import { certificatesActions, certificatesReducer, CertificatesState } from './certificates.reducer'
import { creactOwnCertificate } from './certificates.saga'
import { createUserCsr } from '../../pkijs/generatePems/requestCertificate'
import { createUserCert } from '../../pkijs/generatePems/generateUserCertificate'

describe('checkCertificatesSaga', () => {
  test('creating own cert', () => {
    void expectSaga(creactOwnCertificate, { payload: 'name', type: certificatesActions.creactOwnCertificate.type })
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
