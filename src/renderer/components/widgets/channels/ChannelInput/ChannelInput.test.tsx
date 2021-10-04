import React from 'react'

import { renderComponent } from '../../../../testUtils/renderComponent'
import { INPUT_STATE } from '../../../../store/selectors/channel'
import { ChannelInput } from './ChannelInput'

describe('ChannelInput', () => {
  it('renders component input available ', () => {
    const result = renderComponent(
      <ChannelInput
        onChange={jest.fn()}
        setAnchorEl={jest.fn()}
        setMentionsToSelect={jest.fn()}
        onKeyPress={jest.fn()}
        message='this is just a test message'
        inputState={INPUT_STATE.AVAILABLE}
        channelName={'test'}
        users={{}}
        mentionsToSelect={[]}
        inputPlaceholder='test'
        isMessageTooLong={false}
        infoClass={''}
        setInfoClass={jest.fn()}
        id={''}
        anchorEl={''}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <div
            class="MuiGrid-root makeStyles-root-1"
          >
            <div
              class="MuiGrid-root makeStyles-root-1 MuiGrid-container MuiGrid-direction-xs-column MuiGrid-justify-xs-center"
            >
              <div
                class="MuiGrid-root makeStyles-inputsDiv-5 MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-center"
              >
                <div
                  class="MuiGrid-root makeStyles-textfield-4 MuiGrid-container MuiGrid-item MuiGrid-align-items-xs-center MuiGrid-justify-xs-center MuiGrid-grid-xs-true"
                >
                  <div
                    class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
                  >
                    <div
                      class="makeStyles-input-3"
                      contenteditable="true"
                      placeholder="Message test"
                    >
                      this is just a test message
                      
                    </div>
                  </div>
                  <div
                    class="MuiGrid-root makeStyles-actions-14 MuiGrid-item"
                  >
                    <div
                      class="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-center"
                    >
                      <img
                        class="makeStyles-emoji-13"
                        src="test-file-stub"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="MuiGrid-root makeStyles-boot-129 MuiGrid-container"
              >
                <div
                  class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="MentionPoper-root-124"
          role="tooltip"
          style="position: fixed; top: 0px; left: 0px; transform: translate3d(0px,0px,0px; z-index: -1;"
        >
          <div
            class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
          >
            <div
              class="rc-scrollbars-container"
              style="position: relative; overflow: hidden; width: 100%; height: 0px;"
            >
              <div
                class="rc-scrollbars-view"
                style="position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; overflow: scroll; margin-right: 0px; margin-bottom: 0px;"
              >
                <div
                  class="MuiGrid-root"
                >
                  <div
                    class="MuiGrid-root MuiGrid-container"
                  >
                    <div
                      class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
                    />
                    <div
                      class="MentionPoper-divider-126"
                    />
                  </div>
                </div>
              </div>
              <div
                class="rc-scrollbars-track rc-scrollbars-track-h"
                style="position: absolute; right: 2px; bottom: 2px; z-index: 100; border-radius: 3px; left: 2px; height: 6px; display: none;"
              >
                <div
                  class="rc-scrollbars-thumb rc-scrollbars-thumb-h"
                  style="position: relative; display: block; height: 100%; cursor: pointer; border-radius: inherit; background-color: rgba(0, 0, 0, 0.2);"
                />
              </div>
              <div
                class="rc-scrollbars-track rc-scrollbars-track-v"
                style="position: absolute; right: 2px; bottom: 2px; z-index: 100; border-radius: 3px; top: 2px; width: 6px; display: none;"
              >
                <div
                  class="MentionPoper-thumb-125"
                />
              </div>
            </div>
          </div>
        </div>
      </body>
    `)
  })

  it('renders component input Disable ', () => {
    const result = renderComponent(
      <ChannelInput
        onChange={jest.fn()}
        setAnchorEl={jest.fn()}
        setMentionsToSelect={jest.fn()}
        onKeyPress={jest.fn()}
        message='this is just a test message'
        inputState={INPUT_STATE.NOT_CONNECTED}
        channelName={'test'}
        mentionsToSelect={[]}
        users={{}}
        inputPlaceholder='test'
        isMessageTooLong={false}
        infoClass={''}
        setInfoClass={jest.fn()}
        id={''}
        anchorEl={''}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <div
            class="MuiGrid-root makeStyles-root-157 makeStyles-notAllowed-176"
          >
            <div
              class="MuiGrid-root makeStyles-root-157 MuiGrid-container MuiGrid-direction-xs-column MuiGrid-justify-xs-center"
            >
              <div
                class="MuiGrid-root makeStyles-inputsDiv-161 MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-center"
              >
                <div
                  class="MuiGrid-root makeStyles-textfield-160 MuiGrid-container MuiGrid-item MuiGrid-align-items-xs-center MuiGrid-justify-xs-center MuiGrid-grid-xs-true"
                >
                  <div
                    class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
                  >
                    <div
                      class="makeStyles-input-159"
                      contenteditable="true"
                      placeholder="Message test"
                    >
                      this is just a test message
                      
                    </div>
                  </div>
                  <div
                    class="MuiGrid-root makeStyles-actions-170 MuiGrid-item"
                  >
                    <div
                      class="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-center"
                    >
                      <img
                        class="makeStyles-emoji-169"
                        src="test-file-stub"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="MuiGrid-root makeStyles-boot-285 MuiGrid-container"
              >
                <div
                  class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
                >
                  <span
                    class="MuiTypography-root makeStyles-info-283 MuiTypography-caption"
                  >
                    Loading messages and connecting. This may take a few minutes...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="MentionPoper-root-280"
          role="tooltip"
          style="position: fixed; top: 0px; left: 0px; transform: translate3d(0px,0px,0px; z-index: -1;"
        >
          <div
            class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
          >
            <div
              class="rc-scrollbars-container"
              style="position: relative; overflow: hidden; width: 100%; height: 0px;"
            >
              <div
                class="rc-scrollbars-view"
                style="position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; overflow: scroll; margin-right: 0px; margin-bottom: 0px;"
              >
                <div
                  class="MuiGrid-root"
                >
                  <div
                    class="MuiGrid-root MuiGrid-container"
                  >
                    <div
                      class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
                    />
                    <div
                      class="MentionPoper-divider-282"
                    />
                  </div>
                </div>
              </div>
              <div
                class="rc-scrollbars-track rc-scrollbars-track-h"
                style="position: absolute; right: 2px; bottom: 2px; z-index: 100; border-radius: 3px; left: 2px; height: 6px; display: none;"
              >
                <div
                  class="rc-scrollbars-thumb rc-scrollbars-thumb-h"
                  style="position: relative; display: block; height: 100%; cursor: pointer; border-radius: inherit; background-color: rgba(0, 0, 0, 0.2);"
                />
              </div>
              <div
                class="rc-scrollbars-track rc-scrollbars-track-v"
                style="position: absolute; right: 2px; bottom: 2px; z-index: 100; border-radius: 3px; top: 2px; width: 6px; display: none;"
              >
                <div
                  class="MentionPoper-thumb-281"
                />
              </div>
            </div>
          </div>
        </div>
      </body>
    `)
  })

  it('renders component input Locked ', () => {
    const result = renderComponent(
      <ChannelInput
        onChange={jest.fn()}
        setAnchorEl={jest.fn()}
        setMentionsToSelect={jest.fn()}
        onKeyPress={jest.fn()}
        message='this is just a test message'
        inputState={INPUT_STATE.USER_NOT_REGISTERED}
        channelName={'test'}
        mentionsToSelect={[]}
        users={{}}
        inputPlaceholder='test'
        isMessageTooLong={false}
        infoClass={''}
        setInfoClass={jest.fn()}
        id={''}
        anchorEl={''}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <div
            class="MuiGrid-root makeStyles-root-343 makeStyles-notAllowed-362"
          >
            <div
              class="MuiGrid-root makeStyles-root-343 MuiGrid-container MuiGrid-direction-xs-column MuiGrid-justify-xs-center"
            >
              <div
                class="MuiGrid-root makeStyles-inputsDiv-347 MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-center"
              >
                <div
                  class="MuiGrid-root makeStyles-textfield-346 MuiGrid-container MuiGrid-item MuiGrid-align-items-xs-center MuiGrid-justify-xs-center MuiGrid-grid-xs-true"
                >
                  <div
                    class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
                  >
                    <div
                      class="makeStyles-input-345"
                      contenteditable="true"
                      placeholder="Message test"
                    >
                      this is just a test message
                      
                    </div>
                  </div>
                  <div
                    class="MuiGrid-root makeStyles-actions-356 MuiGrid-item"
                  >
                    <div
                      class="MuiGrid-root MuiGrid-container MuiGrid-align-items-xs-center MuiGrid-justify-xs-center"
                    >
                      <img
                        class="makeStyles-emoji-355"
                        src="test-file-stub"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="MuiGrid-root makeStyles-boot-471 MuiGrid-container"
              >
                <div
                  class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
                >
                  <span
                    class="MuiTypography-root makeStyles-info-469 MuiTypography-caption"
                  >
                    This user needs to update Zbay to receive direct messages.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          class="MentionPoper-root-466"
          role="tooltip"
          style="position: fixed; top: 0px; left: 0px; transform: translate3d(0px,0px,0px; z-index: -1;"
        >
          <div
            class="MuiPaper-root MuiPaper-elevation1 MuiPaper-rounded"
          >
            <div
              class="rc-scrollbars-container"
              style="position: relative; overflow: hidden; width: 100%; height: 0px;"
            >
              <div
                class="rc-scrollbars-view"
                style="position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; overflow: scroll; margin-right: 0px; margin-bottom: 0px;"
              >
                <div
                  class="MuiGrid-root"
                >
                  <div
                    class="MuiGrid-root MuiGrid-container"
                  >
                    <div
                      class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
                    />
                    <div
                      class="MentionPoper-divider-468"
                    />
                  </div>
                </div>
              </div>
              <div
                class="rc-scrollbars-track rc-scrollbars-track-h"
                style="position: absolute; right: 2px; bottom: 2px; z-index: 100; border-radius: 3px; left: 2px; height: 6px; display: none;"
              >
                <div
                  class="rc-scrollbars-thumb rc-scrollbars-thumb-h"
                  style="position: relative; display: block; height: 100%; cursor: pointer; border-radius: inherit; background-color: rgba(0, 0, 0, 0.2);"
                />
              </div>
              <div
                class="rc-scrollbars-track rc-scrollbars-track-v"
                style="position: absolute; right: 2px; bottom: 2px; z-index: 100; border-radius: 3px; top: 2px; width: 6px; display: none;"
              >
                <div
                  class="MentionPoper-thumb-467"
                />
              </div>
            </div>
          </div>
        </div>
      </body>
    `)
  })
})
