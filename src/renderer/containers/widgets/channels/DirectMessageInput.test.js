
import BigNumber from 'bignumber.js'

import { mapStateToProps, mapDispatchToProps } from './DirectMessageInput'

import create from '../../../store/create'
import { ChannelState } from '../../../store/handlers/channel'

describe('ChannelInput', () => {
  let store = null
  beforeEach(() => {
    jest.clearAllMocks()
    store = create({
      initialState: {
        channel: {
          ...ChannelState,
          spentFilterValue: 38,
          name: 'Politics',
          members: new BigNumber(0),
          message: 'This is a test message',
          messages: []
        }
      }
    })
  })

  it('will receive right props', async () => {
    const props = mapStateToProps(store.getState(), { props: {} })
    expect(props).toMatchSnapshot()
  })

  it('will receive right actions', async () => {
    const actions = mapDispatchToProps(x => x, { contactId: 'address123' })
    expect(actions).toMatchSnapshot()
  })
})
