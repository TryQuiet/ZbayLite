import React from 'react'
import { shallow } from 'enzyme'

import { AddModerator } from './AddModerator'

describe('AddModerator', () => {
  it('renders component', () => {
    const result = shallow(
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
    expect(result).toMatchInlineSnapshot(`
      <Component
        addBorder={false}
        alignCloseLeft={false}
        canGoBack={false}
        contentWidth={600}
        fullPage={true}
        handleClose={[Function]}
        isBold={false}
        isCloseDisabled={false}
        open={true}
        title=""
      >
        <WithStyles(ForwardRef(Grid))
          className="makeStyles-root-1"
        >
          <WithStyles(ForwardRef(Grid))
            className="makeStyles-fullContainer-2"
            container={true}
            direction="column"
            justify="flex-start"
          >
            <WithStyles(ForwardRef(Typography))
              className="makeStyles-title-3"
              variant="h3"
            >
              Add a moderator
            </WithStyles(ForwardRef(Typography))>
            <WithStyles(ForwardRef(TextField))
              id="outlined-helperText"
              onChange={[Function]}
              placeholder="Search for usernames"
              variant="outlined"
            />
            <AutoSizer
              disableHeight={false}
              disableWidth={false}
              onResize={[Function]}
              style={Object {}}
            >
              <Component />
            </AutoSizer>
          </WithStyles(ForwardRef(Grid))>
        </WithStyles(ForwardRef(Grid))>
      </Component>
    `)
  })
})
