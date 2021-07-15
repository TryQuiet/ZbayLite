import create from '../../../store/create'
import { mapDispatchToProps, mapStateToProps } from './ChannelInfo'
import { ChannelState } from '../../../store/handlers/channel'

describe('ChannelInfo ', () => {
  let store = null
  const channelId = 'channel-id'
  beforeEach(() => {
    store = create({
      initialState: {
        rates: { usd: '70.45230379033394', zec: '1' },
        channel: {
          ...ChannelState,
          id: channelId,
          shareableUri: 'uri',
          message: 'Message written in the input'
        }
      }
    })
    jest.clearAllMocks()
  })

  it('will receive right props', () => {
    const state = mapStateToProps(store.getState())
    expect(state).toMatchSnapshot()
  })

  it('will receive right actions', () => {
    const actions = mapDispatchToProps(x => x)
    expect(actions).toMatchSnapshot()
  })
})