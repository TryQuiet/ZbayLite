import React from 'react'
import { DateTime } from 'luxon'

import { BasicMessage } from './BasicMessage'
import { now, createMessage } from '../../../testUtils'

import { renderComponent } from '../../../testUtils/renderComponent'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../../store'

describe('BasicMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(DateTime, 'utc').mockImplementationOnce(() => now)
  })

  it('renders component', async () => {
    const message = {
      id: 'string',
      type: 1,
      message: 'string',
      createdAt: 'string',
      nickname: 'string'
    }
    const result = renderComponent(
      <HashRouter>
        <Provider store={store}>
          <BasicMessage
            message={message}
            actionsOpen={false}
            setActionsOpen={jest.fn()}
            allowModeration
          />
        </Provider>
      </HashRouter>
    )
    expect(result.baseElement).toMatchInlineSnapshot()
  })
})
