import React from 'react'
import { shallow } from 'enzyme'
import { NewMessageModal } from './NewMessageModal'
import { mockClasses } from '../../../../shared/testing/mocks'

describe('NewMessageModal', () => {
  it('renders NewMessageModal', () => {
    const result = shallow(
      <NewMessageModal
        classes={mockClasses}
        handleClose={jest.fn()}
        sendMessage={jest.fn()}
        showNotification={jest.fn()}
        open
        users={{}}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
