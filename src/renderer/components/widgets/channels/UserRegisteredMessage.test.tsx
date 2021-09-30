import React from 'react'
import { shallow } from 'enzyme'

import { UserRegisteredMessage } from './UserRegisteredMessage'
import { DisplayableMessage } from '../../../zbay/messages.types'
import { createMessage } from '../../../testUtils'
// import { _UserData } from '../../../store/handlers/users'
describe('UserRegisteredMessage', async () => {
  const message = await createMessage()
  const displayMessage = new DisplayableMessage(message)
  it('renders component', () => {
    const result = shallow(
      <UserRegisteredMessage message={displayMessage} />
    )
    expect(result).toMatchSnapshot()
  })
})
