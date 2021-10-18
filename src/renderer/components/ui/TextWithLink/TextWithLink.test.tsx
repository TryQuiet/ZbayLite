import React from 'react'

import { renderComponent } from '../../../testUtils/renderComponent'
import { TextWithLink } from './TextWithLink'

describe('TextWithLink', () => {
  it('renders component', () => {
    const result = renderComponent(
      <TextWithLink
        text={'Here is simple text'}
        links={[
          {
            tag: 'simple',
            label: 'simple',
            action: () => {
              console.log('linked clicked')
            }
          }
        ]}
      />
    )
    expect(result.baseElement).toMatchInlineSnapshot(`
      <body>
        <div>
          <div>
            Here
             
            is
             
            <a
              class="makeStyles-link-1"
              href=""
            >
              simple
            </a>
             
            text
          </div>
        </div>
      </body>
    `)
  })
})
