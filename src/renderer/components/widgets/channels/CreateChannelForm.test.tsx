import React from 'react'

import { CreateChannelForm } from './CreateChannelForm'

import { renderComponent } from '../../../testUtils/renderComponent'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../../store'

describe('CreateChannelForm', () => {
  it('renders component', () => {
    const result = renderComponent(
      <HashRouter>
        <Provider store={store}>
          <CreateChannelForm
            onSubmit={jest.fn()}
            setStep={jest.fn()}
          />
        </Provider>
      </HashRouter>
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
