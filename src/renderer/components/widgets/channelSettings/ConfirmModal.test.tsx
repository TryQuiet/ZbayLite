import React from 'react'
import { shallow } from 'enzyme'

import { ConfirmModal } from './ConfirmModal'

describe('ConfirmModal', () => {
  it('renders component', () => {
    const result = shallow(
      <ConfirmModal
        handleAction={() => { }}
        handleClose={() => { }}
        title='testtitle'
        actionName='testactionname'
        open
        cancelName={''}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
