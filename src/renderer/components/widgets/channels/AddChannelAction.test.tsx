import React from 'react'

import { AddChannelAction } from './AddChannelAction'
import { renderComponent } from '../../../testUtils/renderComponent'
import { Provider } from 'react-redux'
import store from '../../../store'

describe('BaseChannelsList', () => {
  // TODO: [refactoring] test useState when enzyme is up to date
  it('renders component', () => {
    const openModal = jest.fn()
    const result = renderComponent(
      <Provider store={store}>
        <AddChannelAction openCreateModal={openModal} />
      </Provider>
    )
    expect(result.baseElement).toMatchSnapshot()
  })
})
