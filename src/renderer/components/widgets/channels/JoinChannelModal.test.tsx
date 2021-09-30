import React from 'react'
import { shallow } from 'enzyme'

import { JoinChannelModal } from './JoinChannelModal'

describe('JoinChannelModal', () => {
  it('renders component', () => {
    const users = {
      username: '',
      onionAddress: '',
      peerId: '',
      dmPublicKey: ''
    }
    const result = shallow(
      <JoinChannelModal
        open
        handleClose={() => { }}
        joinChannel={() => { }}
        showNotification={() => { }}
        publicChannels={{}}
        users={users}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
