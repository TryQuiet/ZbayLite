/* eslint import/first: 0 */
jest.mock('../../../containers/widgets/channelSettings/BlockedUsers', () => {
  const TabContent = () => <div>TabContent</div>
  return TabContent
})
jest.mock('../../../containers/widgets/channelSettings/Moderators', () => {
  const TabContent = () => <div>TabContent</div>
  return TabContent
})
import React from 'react'
import { shallow } from 'enzyme'

import { ChannelSettingsModal } from './ChannelSettingsModal'
import { Contact } from '../../../store/handlers/contacts'

describe('ChannelSettingsModal', () => {
  it('renders component', () => {
    const contact = new Contact()
    const result = shallow(
      <ChannelSettingsModal
        channel={contact}
        setCurrentTab={() => { }}
        handleClose={() => { }}
        currentTab='blockedUsers'
        open
        isOwner
        modalTabToOpen={jest.fn()}
        clearCurrentOpenTab={jest.fn()}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
