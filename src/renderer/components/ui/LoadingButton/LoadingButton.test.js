import React from 'react'

import { renderComponent } from '../../../testUtils/renderComponent'
import { LoadingButton } from './LoadingButton'

describe('Loading button', () => {
  it('renders component', () => {
    const result = renderComponent(<LoadingButton inProgress='false' text='Loading...' />)
    expect(result.baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <button
            class="MuiButtonBase-root MuiButton-root MuiButton-text makeStyles-button-1 makeStyles-inProgress-2 undefined"
            tabindex="0"
            type="button"
          >
            <span
              class="MuiButton-label"
            >
              <div
                class="MuiCircularProgress-root makeStyles-progress-3 MuiCircularProgress-colorPrimary MuiCircularProgress-indeterminate"
                role="progressbar"
                style="width: 40px; height: 40px;"
              >
                <svg
                  class="MuiCircularProgress-svg"
                  viewBox="22 22 44 44"
                >
                  <circle
                    class="MuiCircularProgress-circle MuiCircularProgress-circleIndeterminate"
                    cx="44"
                    cy="44"
                    fill="none"
                    r="20.2"
                    stroke-width="3.6"
                  />
                </svg>
              </div>
            </span>
            <span
              class="MuiTouchRipple-root"
            />
          </button>
        </div>
      </body>
    `)
  })
})
