import { call, apply, all, takeEvery, put } from 'typed-redux-saga'
import { PayloadAction } from '@reduxjs/toolkit'

import { certificatesActions } from './certificates.reducer'
import { createUserCsr } from '../../pkijs/generatePems/requestCertificate'
import electronStore from '../../../shared/electronStore'
import { takeLeading } from 'redux-saga/effects'
import { registrationServiceAddress } from '../../../shared/static'

export function* responseGetCertificates(
  action: PayloadAction<ReturnType<typeof certificatesActions.responseGetCertificates>['payload']>
): Generator {
  const certificates = action.payload
  console.log('RESPONSE GET CERTIFICATES', certificates)
  yield* put(certificatesActions.setUsersCertificates(certificates.certificates))
}

export function* createOwnCertificate(
  action: PayloadAction<ReturnType<typeof certificatesActions.createOwnCertificate>['payload']>
): Generator {
  interface HiddenServicesType {
    libp2pHiddenService?: {
      onionAddress: string
      privateKey: string
    }
  }

  const hiddenServices: HiddenServicesType = yield* apply(
    electronStore,
    electronStore.get,
    ['hiddenServices']
  )

  let peerIdAddress = yield* apply(electronStore, electronStore.get, ['peerId'])
  if (!peerIdAddress) {
    peerIdAddress = 'unknown'
  }

  const userData = {
    zbayNickname: action.payload,
    commonName: hiddenServices.libp2pHiddenService.onionAddress,
    peerId: peerIdAddress
  }

  console.log('userData', userData)

  const user = yield* call(createUserCsr, userData)

  yield put(
    certificatesActions.registerUserCertificate({
      serviceAddress: registrationServiceAddress,
      userCsr: user.userCsr // 'IncorrectCSR'
    })
  )
  yield* put(certificatesActions.setOwnCertKey(user.userKey))
  console.log('After registering csr')
}

export function* certificatesSaga(): Generator {
  yield* all([
    takeEvery(certificatesActions.responseGetCertificates.type, responseGetCertificates),
    takeEvery(certificatesActions.createOwnCertificate.type, createOwnCertificate),
  ])
}
