import { Store } from '../reducers'
import { createSelector } from 'reselect'

const certificates = (s: Store) => s.certificates
const ownCertificate = createSelector(certificates, d => d.ownCertificate.certificate)

export default {
  certificates,
  ownCertificate
}
