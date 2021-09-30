import React from 'react'
import { shallow } from 'enzyme'

import { SendMessagePopover } from './SendMessagePopover'

describe('SendMessagePopover', () => {
  it('renders popover', () => {
    const ref = React.createRef<HTMLAnchorElement>()
    const result = shallow(
      <SendMessagePopover
        anchorEl={ref.current}
        handleClose={jest.fn()}
        username='TestUser'
        users={{}}
        address={'ztestsapling1juf4322spfp2nhmqaz5wymw8nkkxxyv06x38cel2nj6d7s8fdyd6dlsmc6efv02sf0kty2v7lfz'}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
