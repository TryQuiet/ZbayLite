import { initialState as channelsState } from '../../../store/handlers/channels'
import { mapStateToProps, mapDispatchToProps } from './ChannelsPanel'
import { createChannel } from '../../../testUtils'
import create from '../../../store/create'
import { NodeState } from '../../../store/handlers/node'
import { initialState } from '../../../store/handlers/identity'

describe('ChannelsPanel', () => {
  let store = null

  beforeEach(() => {
    jest.clearAllMocks()
    store = create({
      initialState: {
        node: {
          ...NodeState,
          isTestnet: true
        },
        channels: {
          ...channelsState,
          data: [createChannel(1), createChannel(2)]
        },
        identity: {
          initialState,
          loader: { loading: false }
        }
      }
    })
  })

  it('will receive right props', async () => {
    const props = mapStateToProps(store.getState())
    expect(props).toMatchSnapshot()
  })
  it('will receive right actions', async () => {
    const actions = mapDispatchToProps(x => x)
    expect(actions).toMatchSnapshot()
  })
})
