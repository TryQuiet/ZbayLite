import { all, takeEvery, put, apply } from 'redux-saga/effects'
import { call } from 'typed-redux-saga'

import { certificatesActions } from './certificates.reducer'
import { createUserCsr } from '../../pkijs/generatePems/requestCertificate'
import { createUserCert } from '../../pkijs/generatePems/generateUserCertificate'
import { dataFromRootPems } from '../../../shared/static'
import electronStore from '../../../shared/electronStore'
import { PayloadAction } from '@reduxjs/toolkit'

export function* responseGetCertificates(
  action: PayloadAction<ReturnType<typeof certificatesActions.responseGetCertificates>['payload']>
): Generator {
  const certificates = action.payload
  yield put(certificatesActions.setUsersCertificates(certificates))
}

const getDate = (date?: string) => new Date(date)

export function* creactOwnCertificate(
  action: PayloadAction<ReturnType<typeof certificatesActions.creactOwnCertificate>['payload']>
): Generator {
  const certString = dataFromRootPems.certificate
  const keyString = dataFromRootPems.privKey

  const notBeforeDate = yield call(getDate)
  const notAfterDate = yield call(getDate, '1/1/2031')

  yield apply(electronStore, electronStore.get, ['hiddenServices'])

  const userData = {
    zbayNickname: action.payload,
    commonName: electronStore.get('hiddenServices').libp2pHiddenService.onionAddress,
    peerId: electronStore.get('peerId')
  }

  const user = yield* call(createUserCsr, userData)
  const userCertData = yield* call(createUserCert, certString, keyString, user.userCsr, notBeforeDate, notAfterDate)

  yield put(certificatesActions.setOwnCertificate(userCertData.userCertString))
  yield put(certificatesActions.setOwnCertKey(user.userKey))
  yield put(certificatesActions.saveCertificate(userCertData.userCertString))
}

export function* certificatesSaga(): Generator {
  yield all([
    takeEvery(certificatesActions.responseGetCertificates.type, responseGetCertificates),
    takeEvery(certificatesActions.creactOwnCertificate.type, creactOwnCertificate)
  ])
}
