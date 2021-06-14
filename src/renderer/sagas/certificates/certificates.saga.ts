import { all, takeEvery, put } from 'redux-saga/effects'
import { CertificatesActions, certificatesActions } from './certificates.reducer'
import { actions as certificateActions } from '../../store/handlers/certificates'

export function* responseGetCertificates(
  action: CertificatesActions['responseGetCertificates']
): Generator {
  const certificates = action.payload.certificates
  yield put(certificateActions.setUsersCertificates(certificates))
}

export function* certificatesSaga(): Generator {
  yield all([
    takeEvery(certificatesActions.responseGetCertificates.type, responseGetCertificates)
  ])
}
