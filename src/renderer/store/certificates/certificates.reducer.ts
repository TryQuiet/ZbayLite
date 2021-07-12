import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export class CertificatesState {
  usersCertificates: string[] = ['']
  ownCertificate = {
    certificate: '',
    privateKey: ''
  }
  registrationError: string = null
}

export const certificates = createSlice({
  initialState: { ...new CertificatesState() },
  name: 'Certificates',
  reducers: {
    setUsersCertificates: (state, action: PayloadAction<string[]>) => {
      state.usersCertificates = action.payload
    },
    setOwnCertificate: (state, action: PayloadAction<string>) => {
      console.log('Setting own cert!!', action.payload)
      state.ownCertificate.certificate = action.payload
    },
    setOwnCertKey: (state, action: PayloadAction<string>) => {
      state.ownCertificate.privateKey = action.payload
    },
    setRegistrationError: (state, action: PayloadAction<string>) => {
      console.log('Setting registration error!!', action.payload)
      state.registrationError = action.payload
    },
    createOwnCertificate: (state, _action: PayloadAction<string>) => {
      return state
    },
    registerUserCertificate: (state, _action: PayloadAction<{serviceAddress: string, userCsr: string}>) => {
      state.registrationError = null
      state.ownCertificate.certificate = ''
      console.log('registerUserCertificate action')
      return state
    },
    saveCertificate: (state, _action: PayloadAction<string>) => {
      return state
    },
    responseGetCertificates: (state, _action: PayloadAction<{ certificates: string[] }>) => {
      return state
    },
    responseGetCertificate: (state, _action: PayloadAction<string>) => {
      return state
    }
  }
})

export const certificatesActions = certificates.actions
export const certificatesReducer = certificates.reducer
