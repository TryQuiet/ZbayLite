import { produce } from 'immer'
import { createAction, handleActions } from 'redux-actions'
import { actionTypes, dataFromRootPems } from '../../../shared/static'
import { ActionsType, PayloadType } from './types'
import { createUserCsr } from '../../pkijs/generatePems/requestCertificate'
import { createUserCert } from '../../pkijs/generatePems/generateUserCertificate'
import electronStore from '../../../shared/electronStore'

export interface CertificatesStore {
  usersCertificates: string[]
  ownCertificate: {
    certificate: string
    privateKey: string
  }
}
export const initialState: CertificatesStore = {
  usersCertificates: [],
  ownCertificate: {
    certificate: '',
    privateKey: ''
  }
}

export const setUsersCertificates = createAction(actionTypes.SET_USERS_CERTIFICATES)
export const setOwnCertificate = createAction<string>(actionTypes.SET_OWN_CERTIFICATE)
export const setOwnCertKey = createAction<string>(actionTypes.SET_OWN_CERT_KEY)

export const actions = {
  setUsersCertificates,
  setOwnCertificate,
  setOwnCertKey
}
export type CertificatesActions = ActionsType<typeof actions>

export const createOwnCertificate = (nickname: string) => async dispatch => {
  const certString = dataFromRootPems.certificate
  const keyString = dataFromRootPems.privKey
  const notBeforeDate = new Date()
  const notAfterDate = new Date(2030, 1, 1)

  const userData = {
    zbayNickname: nickname,
    commonName: electronStore.get('hiddenServices').libp2pHiddenService.onionAddress,
    peerId: electronStore.get('peerId')
  }
  const user = await createUserCsr(userData)
  const userCertData = await createUserCert(certString, keyString, user.userCsr, notBeforeDate, notAfterDate)

  await dispatch(setOwnCertificate(userCertData.userCertString))
  await dispatch(setOwnCertKey(user.userKey))

  return userCertData.userCertString
}

const epics = {
  createOwnCertificate
}

export const reducer = handleActions<CertificatesStore, PayloadType<CertificatesActions>>(
  {
    [setUsersCertificates.toString()]: (state, { payload: certificates }: CertificatesActions['setUsersCertificates']) =>
      produce(state, draft => {
        draft.usersCertificates = certificates
      }),
    [setOwnCertificate.toString()]: (
      state,
      { payload: certificate }: CertificatesActions['setOwnCertificate']
    ) =>
      produce(state, draft => {
        draft.ownCertificate.certificate = certificate
      }),
    [setOwnCertKey.toString()]: (
      state,
      { payload: certPrivKey }: CertificatesActions['setOwnCertKey']
    ) =>
      produce(state, draft => {
        draft.ownCertificate.privateKey = certPrivKey
      })
  },
  initialState
)

export default {
  actions,
  epics,
  reducer
}
