import React from 'react'
import { shallow } from 'enzyme'

import { Moderators } from './Moderators'

describe('Moderators', () => {
  it('renders component', () => {
    const users = {
      username: '',
      onionAddress: '',
      peerId: '',
      dmPublicKey: ''
    }
    const result = shallow(
      <Moderators
        users={users}
        moderators={[]}
        openAddModerator={() => { }}
        removeModerator={() => { }}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
