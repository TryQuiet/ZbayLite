import React from 'react'
import { shallow } from 'enzyme'

import { ModeratorActionsPopper } from './ModeratorActionsPopper'

describe('ModeratorActionsPopper', () => {
  it('renders', () => {
    const ref = React.createRef<HTMLAnchorElement>()
    const result = shallow(
      <ModeratorActionsPopper
        name='123'
        address='123'
        open
        anchorEl={ref.current}
        banUser={jest.fn()}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
