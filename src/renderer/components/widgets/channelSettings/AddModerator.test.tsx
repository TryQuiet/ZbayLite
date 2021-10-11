import React from 'react'
import { renderComponent } from '../../../testUtils/renderComponent'

import { AddModerator } from './AddModerator'

describe('AddModerator', () => {
  it('renders component', () => {
    const result = renderComponent(
      <AddModerator
        open
        handleClose={() => {}}
        members={[]}
        users={{
          member: {
            nickname: 'string'
          }
        }}
        addModerator={() => {}}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot(`
      <body
        style="overflow: hidden; padding-right: 0px;"
      >
        <div
          aria-hidden="true"
        />
        <div
          class="makeStyles-root-4"
          role="presentation"
          style="position: fixed; z-index: 1300; right: 0px; bottom: 0px; top: 0px; left: 0px;"
        >
          <div
            aria-hidden="true"
            style="z-index: -1; position: fixed; right: 0px; bottom: 0px; top: 0px; left: 0px; background-color: rgba(0, 0, 0, 0.5);"
          />
          <div
            data-test="sentinelStart"
            tabindex="0"
          />
          <div
            class="MuiGrid-root makeStyles-centered-11 makeStyles-window-12 MuiGrid-container MuiGrid-direction-xs-column MuiGrid-justify-xs-center"
            tabindex="-1"
          >
            <div
              class="MuiGrid-root makeStyles-header-6 MuiGrid-container MuiGrid-item MuiGrid-align-items-xs-center"
            >
              <div
                class="MuiGrid-root MuiGrid-container MuiGrid-item MuiGrid-align-items-xs-center MuiGrid-justify-xs-center MuiGrid-grid-xs-true"
              >
                <div
                  class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-true"
                >
                  <h6
                    class="MuiTypography-root makeStyles-title-5 MuiTypography-subtitle1 MuiTypography-alignCenter"
                    style="margin-left: 36px;"
                  />
                </div>
                <div
                  class="MuiGrid-root MuiGrid-item"
                >
                  <div
                    class="MuiGrid-root makeStyles-actions-8 MuiGrid-container MuiGrid-item MuiGrid-justify-xs-flex-end"
                  >
                    <button
                      class="MuiButtonBase-root MuiIconButton-root makeStyles-root-147"
                      tabindex="0"
                      type="button"
                    >
                      <span
                        class="MuiIconButton-label"
                      >
                        <svg
                          aria-hidden="true"
                          class="MuiSvgIcon-root"
                          focusable="false"
                          role="presentation"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                          />
                        </svg>
                      </span>
                      <span
                        class="MuiTouchRipple-root"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="MuiGrid-root makeStyles-fullPage-10 MuiGrid-container MuiGrid-item MuiGrid-justify-xs-center"
            >
              <div
                class="MuiGrid-root makeStyles-content-9 MuiGrid-container MuiGrid-item"
                style="width: 600px;"
              >
                <div
                  class="MuiGrid-root makeStyles-root-1"
                >
                  <div
                    class="MuiGrid-root makeStyles-fullContainer-2 MuiGrid-container MuiGrid-direction-xs-column"
                  >
                    <h3
                      class="MuiTypography-root makeStyles-title-3 MuiTypography-h3"
                    >
                      Add a moderator
                    </h3>
                    <div
                      class="MuiFormControl-root MuiTextField-root"
                    >
                      <div
                        class="MuiInputBase-root MuiOutlinedInput-root MuiInputBase-formControl"
                      >
                        <input
                          aria-invalid="false"
                          class="MuiInputBase-input MuiOutlinedInput-input"
                          id="outlined-helperText"
                          placeholder="Search for usernames"
                          type="text"
                          value=""
                        />
                        <fieldset
                          aria-hidden="true"
                          class="PrivateNotchedOutline-root-209 MuiOutlinedInput-notchedOutline"
                          style="padding-left: 8px;"
                        >
                          <legend
                            class="PrivateNotchedOutline-legend-210"
                            style="width: 0.01px;"
                          >
                            <span>
                              ​
                            </span>
                          </legend>
                        </fieldset>
                      </div>
                    </div>
                    <div
                      style="overflow: visible; height: 0px; width: 0px;"
                    >
                      <div
                        class="rc-scrollbars-container"
                        style="position: relative; overflow: hidden; width: 0px; height: 0px; overflow-x: hidden;"
                      >
                        <div
                          class="rc-scrollbars-view"
                          style="position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; overflow: scroll; margin-right: 0px; margin-bottom: 0px;"
                        />
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
                            class="rc-scrollbars-thumb rc-scrollbars-thumb-v"
                            style="position: relative; display: block; height: 100%; cursor: pointer; border-radius: inherit; background-color: rgba(0, 0, 0, 0.2);"
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      class="resize-triggers"
                    >
                      <div
                        class="expand-trigger"
                      >
                        <div
                          style="width: 1px; height: 1px;"
                        />
                      </div>
                      <div
                        class="contract-trigger"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-test="sentinelEnd"
            tabindex="0"
          />
        </div>
      </body>
    `)
  })
})