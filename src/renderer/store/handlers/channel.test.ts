import { DateTime } from 'luxon'
import create from '../create'
import { ChannelState, actions } from './channel'
import channelSelectors from '../selectors/channel'

describe('channel reducer', () => {
  const identityId = 'test-identity-id'
  const address = 'zs1z7rejlpsa98s2rrrfkwmaxu53e4ue0ulcrw0h4x5g8jl04tak0d3mm47vdtahatqrlkngh9slya'

  let store = null
  beforeEach(async () => {
    // window.Notification = jest.fn()

    store = create({
      channel: {
        ...ChannelState
      },
      identity: {
        data: {
          id: identityId,
          address,
          name: 'Saturn',
          balance: '33.583004',
          signerPrivKey: '879aff43df53606d8ae1219d9347360e7a30d1c2f141e14c9bc96bb29bf930cb'
        }
      },
      operations: {}
    })
    jest.spyOn(DateTime, 'utc').mockImplementation(() => DateTime.utc(2019, 3, 7, 13, 3, 48))
    jest.clearAllMocks()
  })

  describe('handles actions', () => {
    it(' - setMessage', () => {
      const msg = 'this is a test message'
      const id = '1'
      store.dispatch(actions.setChannelId(id))
      store.dispatch(actions.setMessage({ value: msg, id }))
      const result = channelSelectors.message(store.getState())
      expect(result).toEqual(msg)
    })
  })
})
