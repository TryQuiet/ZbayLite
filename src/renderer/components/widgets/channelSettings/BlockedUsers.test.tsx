import React from 'react'
import { shallow } from 'enzyme'

import { BlockedUsers } from './BlockedUsers'

describe('BlockedUsers', () => {
  it('renders component', () => {
    const users = {
      username: '',
      onionAddress: '',
      peerId: '',
      dmPublicKey: ''
    }
    const result = shallow(
      <BlockedUsers
        users={[users]}
        blockedUsers={['']}
        unblockUser={() => { }}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
