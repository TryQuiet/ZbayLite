import React from 'react'
import { shallow } from 'enzyme'
import { NewMessageModal } from './NewMessageModal'

describe('NewMessageModal', () => {
  it('renders NewMessageModal', () => {
    const users = {
      username: '',
      onionAddress: '',
      peerId: '',
      dmPublicKey: ''
    }
    const result = shallow(
      <NewMessageModal
        handleClose={jest.fn()}
        sendMessage={jest.fn()}
        showNotification={jest.fn()}
        open
        users={users}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
