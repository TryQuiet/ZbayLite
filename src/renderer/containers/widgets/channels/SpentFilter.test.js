import { mapStateToProps, mapDispatchToProps } from './SpentFilter'

import create from '../../../store/create'
import { ChannelState } from '../../../store/handlers/channel'

describe('NodePanelBlocksField', () => {
  let store = null
  beforeEach(() => {
    jest.clearAllMocks()
    store = create({
      initialState: {
        channel: {
          ...ChannelState,
          spentFilterValue: 38
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
