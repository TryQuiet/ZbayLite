import React from 'react'
import { shallow } from 'enzyme'

import { UserListItem } from './UserListItem'

describe('UserListItem', () => {
  it('renders component', () => {
    const result = shallow(
      <UserListItem
        name='testname'
        action={() => { }}
        disableConfirmation
        actionName='testactionname'
      />
    )
    expect(result).toMatchSnapshot()
  })
})
