import React from 'react'
import { DateTime } from 'luxon'
import { now } from '../../../../testUtils'

import { renderComponent } from '../../../../testUtils/renderComponent'
import { InviteMentionInfo } from './InviteMentionInfo'

describe('InviteMentionInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(DateTime, 'utc').mockImplementationOnce(() => now)
  })
  it('renders component', () => {
    const result = renderComponent(
      <InviteMentionInfo
        handleClose={jest.fn()}
        handleInvite={jest.fn()}
        nickname='test'
        timeStamp={0}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
