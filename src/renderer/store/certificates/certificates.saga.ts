import { createAction } from '@reduxjs/toolkit'
import { all, takeEvery, put } from 'redux-saga/effects'

import { certificatesActions } from './certificates.reducer'
import { ActionsType, Socket } from '../../sagas/const/actionsTypes'

import { createUserCsr } from '../../pkijs/generatePems/requestCertificate'
import { createUserCert } from '../../pkijs/generatePems/generateUserCertificate'
import { dataFromRootPems } from '../../../shared/static'

import electronStore from '../../../shared/electronStore'

export function* responseGetCertificates(
  action: CertificatesActions['responseGetCertificates']
): Generator {
  const certificates = action.payload.certificates
  yield put(certificatesActions.setUsersCertificates(certificates))
}

export function* creactOwnCertificate(nickname) {
  const certString = dataFromRootPems.certificate
  const keyString = dataFromRootPems.privKey
  const notBeforeDate = new Date()
  const notAfterDate = new Date(2030, 1, 1)

  const userData = {
    zbayNickname: nickname,
    commonName: electronStore.get('hiddenServices').libp2pHiddenService.onionAddress,
    peerId: electronStore.get('peerId')
  }
  const user = yield createUserCsr(userData)
  const userCertData = yield createUserCert(certString, keyString, user.userCsr, notBeforeDate, notAfterDate)

  yield put(certificatesActions.setOwnCertificate(userCertData.userCertString))
  yield put(certificatesActions.setOwnCertKey(user.userKey))
  yield put(certificatesActionsSaga.saveCertificate(userCertData.userCertString))
}

export function* certificatesSaga(): Generator {
  yield all([
    takeEvery(certificatesActionsSaga.responseGetCertificates.type, responseGetCertificates),
    takeEvery(certificatesActionsSaga.creactOwnCertificate.type, creactOwnCertificate)
  ])
}

export type CertificatesActions = ActionsType<typeof certificatesActionsSaga>
export const certificatesActionsSaga = {
  responseGetCertificates: createAction<{ certificates: string[] }, Socket.RESPONSE_GET_CERTIFICATES>(Socket.RESPONSE_GET_CERTIFICATES),
  saveCertificate: createAction<string, Socket.SAVE_CERTIFICATE>(Socket.SAVE_CERTIFICATE),
  creactOwnCertificate: createAction<string>(Socket.CREATE_OWN_CERTIFICATE)
}
