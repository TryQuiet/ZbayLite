import React from 'react'
import { DateTime } from 'luxon'

import { BasicMessageComponent } from './BasicMessage'

import { renderComponent } from '../../../testUtils/renderComponent'
import { HashRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../../../store'

describe('BasicMessage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.spyOn(DateTime, 'utc').mockImplementationOnce(() => DateTime.utc(2019, 3, 7, 13, 3, 48))
  })

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
          <BasicMessageComponent messages={[message]} />
        </Provider>
      </HashRouter>
    )
    expect(result.baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <li
            class="MuiListItem-root makeStyles-wrapper-2 makeStyles-wrapperPending-4 MuiListItem-gutters"
          >
            <div
              class="MuiListItemText-root makeStyles-messageCard-1"
            >
              <div
                class="MuiGrid-root MuiGrid-container MuiGrid-wrap-xs-nowrap MuiGrid-align-items-xs-flex-start"
              >
                <div
                  class="MuiGrid-root makeStyles-avatar-9 MuiGrid-item"
                >
                  <div
                    class="makeStyles-alignAvatar-10"
                  >
                    Jdenticon
                  </div>
                </div>
                <div
                  class="MuiGrid-root MuiGrid-container MuiGrid-item"
                >
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
                          string
                        </p>
                      </div>
                      <div
                        class="MuiGrid-root MuiGrid-item"
                      >
                        <p
                          class="MuiTypography-root makeStyles-time-12 MuiTypography-body1"
                        >
                          string
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    class="MuiGrid-root MuiGrid-container MuiGrid-direction-xs-column"
                  >
                    <div
                      class="MuiGrid-root makeStyles-firstMessage-165 MuiGrid-item"
                    >
                      <p
                        class="MuiTypography-root makeStyles-message-164 MuiTypography-body1"
                        data-testid="messagesGroupContent-string"
                      >
                        string
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </div>
      </body>
    `)
  })
})
