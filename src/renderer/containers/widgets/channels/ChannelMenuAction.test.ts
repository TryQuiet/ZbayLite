
import { mapDispatchToProps } from './ChannelMenuAction'

describe('ChannelMenuAction', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('will receive right actions', async () => {
    const actions = mapDispatchToProps(x => x)
    expect(actions).toMatchSnapshot()
  })
})
