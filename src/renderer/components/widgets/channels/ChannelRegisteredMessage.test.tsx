import React from 'react'

import { ChannelRegisteredMessage } from './ChannelRegisteredMessage'

import { renderComponent } from '../../../testUtils/renderComponent'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../../store'

describe('ChannelRegisteredMessage', async () => {
  it('renders component', async () => {
    const message = {
      id: 'string',
      type: 1,
      message: 'string',
      createdAt: 0,
      date: 'string',
      nickname: 'string'
    }
    const result = renderComponent(
      <HashRouter>
        <Provider store={store}>
          <ChannelRegisteredMessage
            username='testUsername'
            onChannelClick={() => {}}
            message={message}
          />
        </Provider>
      </HashRouter>
    )
    expect(result.baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <li
            class="MuiListItem-root makeStyles-wrapper-4 MuiListItem-gutters"
          >
            <div
              class="MuiListItemText-root makeStyles-messageCard-3 MuiListItemText-multiline"
            >
              <div
                class="MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-flex-start"
              >
                <div
                  class="MuiGrid-root makeStyles-avatar-6 MuiGrid-item"
                >
                  <img
                    class="makeStyles-icon-9"
                    src="test-file-stub"
                  />
                </div>
                <div
                  class="MuiGrid-root MuiGrid-container MuiGrid-item MuiGrid-justify-xs-space-between"
                >
                  <div
                    class="MuiGrid-root MuiGrid-container MuiGrid-item MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-flex-start MuiGrid-grid-xs-true"
                  >
                    <div
                      class="MuiGrid-root MuiGrid-item"
                    >
                      <p
                        class="MuiTypography-root makeStyles-username-5 MuiTypography-body1 MuiTypography-colorTextPrimary"
                      >
                        Zbay
                      </p>
                    </div>
                    <div
                      class="MuiGrid-root MuiGrid-item"
                    >
                      <p
                        class="MuiTypography-root makeStyles-time-10 MuiTypography-body1"
                      >
                        0
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="MuiGrid-root makeStyles-messageInput-8 MuiGrid-item"
              >
                <p
                  class="MuiTypography-root makeStyles-message-7 MuiTypography-body2"
                >
                  <span
                    class="makeStyles-nickname-1"
                  >
                    testUsername
                  </span>
                  <span>
                     
                    just published
                     
                    <span
                      class="makeStyles-link-2"
                    >
                      #
                      string
                    </span>
                     
                    on zbay!
                  </span>
                </p>
              </div>
            </div>
          </li>
        </div>
      </body>
    `)
  })
})
