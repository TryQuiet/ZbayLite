import React from 'react'
import { shallow } from 'enzyme'

import { AddModerator } from './AddModerator'

describe('AddModerator', () => {
  it('renders component', () => {
    const result = shallow(
      <AddModerator
        open
        handleClose={() => { }}
        members={[]}
        users={{
          member: {
            nickname: 'string'
          }
        }}
        addModerator={() => { }}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
