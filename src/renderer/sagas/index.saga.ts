import { all, fork } from 'redux-saga/effects'
// import { directMessagesSaga } from './directMessages/directMessages.saga'
// import { publicChannels } from '@zbayapp/nectar'
// import { publicChannelsSaga } from './publicChannels/publicChannels.saga'
import { socketSaga } from './socket/socket.saga'
// import { certificatesSaga } from '../store/certificates/certificates.saga'

export default function* root(socket): Generator {
  yield all([
    // fork(publicChannels.saga, socket),
    // fork(directMessagesSaga),
    // fork(certificatesSaga),
    fork(socketSaga)
  ])
}
