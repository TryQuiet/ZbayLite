import React from 'react'
import { shallow } from 'enzyme'

import { ImportedChannel } from './ImportedChannel'
import { mockClasses } from '../../../../shared/testing/mocks'

describe('ImportedChannel', () => {
  it('renders private channel', () => {
    const channel = {
      name: 'Test channel',
      private: true,
      address: 'testaddress',
      description: 'This is a description of the test channel'
    }
    const result = shallow(
      <ImportedChannel
        open
        classes={mockClasses}
        onAccept={jest.fn()}
        onCancel={jest.fn()}
        handleClose={jest.fn()}
        setIsLoading={jest.fn()}
        isLoading={false}
        channel={channel}
      />
    )
    expect(result).toMatchSnapshot()
  })

  it('renders public channel', () => {
    const channel = {
      name: 'Test channel',
      private: false,
      address: 'testaddress',
      description: 'This is a description of the test channel'
    }
    const result = shallow(
      <ImportedChannel
        open
        classes={mockClasses}
        onAccept={jest.fn()}
        onCancel={jest.fn()}
        handleClose={jest.fn()}
        setIsLoading={jest.fn()}
        isLoading={false}
        channel={channel}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
