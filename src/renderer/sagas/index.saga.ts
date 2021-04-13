import { all, fork } from 'redux-saga/effects'
import { directMessagesSaga } from './directMessages/directMessages.saga'

import { publicChannelsSaga } from './publicChannels/publicChannels.saga'
import { startConnection } from './socket/socket.saga'

export default function* root (): Generator {
  yield all([
    fork(publicChannelsSaga),
    fork(directMessagesSaga),
    fork(startConnection)
  ])
}
