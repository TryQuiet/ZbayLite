import React from 'react'
import { shallow } from 'enzyme'
import { BlockedUsers } from './BlockedUsers'
import { Contact } from '../../../store/handlers/contacts'

describe('BlockedUsers', () => {
  it('renders component', () => {
    const props = {
      unblock: jest.fn(),
      users: [new Contact()],
      blockedUsers: {
        username: '',
        onionAddress: '',
        peerId: '',
        dmPublicKey: ''
      }
    }
    const result = shallow(<BlockedUsers {...props} />)
    expect(result).toMatchSnapshot()
  })
})
