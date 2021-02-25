/* eslint import/first: 0 */
import { mapStateToProps } from './ChannelContent'

import create from '../../../store/create'
import { ChannelState } from '../../../store/handlers/channel'

describe('ChannelContent', () => {
  let store = null
  beforeEach(() => {
    jest.clearAllMocks()
    store = create({
      channel: {
        ...ChannelState
      }
    })
  })

  it('will receive right props', async () => {
    const props = mapStateToProps(store.getState())
    expect(props).toMatchSnapshot()
  })
})
