import React from 'react'
import { shallow } from 'enzyme'

import { Notifications } from './Notifications'
import { Contact } from '../../../store/handlers/contacts'

describe('Notifications', () => {
  it('renders component', () => {
    const contact = new Contact()
    const result = shallow(
      <Notifications
        channelData={contact}
        openNotificationsTab={() => { }}
        setChannelsNotification={() => { }}
        openSettingsModal={() => { }}
        currentFilter={1}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
