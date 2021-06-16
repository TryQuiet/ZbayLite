import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export class CertificatesState {
  usersCertificates: string[] = ['aa', 'bb']
  ownCertificate = {
    certificate: 'hejStore',
    privateKey: ''
  }
}

export const certificates = createSlice({
  initialState: { ...new CertificatesState() },
  name: 'Certificates',
  reducers: {
    setUsersCertificates: (state, action: PayloadAction<string[]>) => {
      state.usersCertificates = action.payload
    },
    setOwnCertificate: (state, action: PayloadAction<string>) => {
      state.ownCertificate.certificate = action.payload
    },
    setOwnCertKey: (state, action: PayloadAction<string>) => {
      state.ownCertificate.privateKey = action.payload
    }
  }
})

export const certificatesActions = certificates.actions
export const certificatesReducer = certificates.reducer
