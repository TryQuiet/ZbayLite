import React from 'react'
import { shallow } from 'enzyme'
import { Notifications } from './Notifications'

describe('Notifications', () => {
  it('renders component', () => {
    const props = {
      userFilterType: 1,
      userSound: 1,
      setUserNotification: jest.fn(),
      setUserNotificationsSound: jest.fn()
    }
    const result = shallow(<Notifications {...props} />)
    expect(result).toMatchSnapshot()
  })
})
