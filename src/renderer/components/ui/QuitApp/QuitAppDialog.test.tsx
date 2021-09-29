import React from 'react'

import { renderComponent } from '../../../testUtils/renderComponent'
import { QuitAppDialog } from './QuitAppDialog'


import renderer, { act, ReactTestRenderer } from 'react-test-renderer';

import { MuiThemeProvider } from '@material-ui/core';
import theme from '../../../theme';
import ReactDOM from 'react-dom';

describe('QuitAppDialog', () => {

  beforeAll(() => {
    ReactDOM.createPortal = jest.fn((element, _node) => {
      return element
    })
  })

  it('renders component', () => {
    let wrapper: ReactTestRenderer
    act(() => {
      wrapper = renderer.create(
        <MuiThemeProvider theme={theme}>
          <QuitAppDialog open handleClose={jest.fn()} handleQuit={jest.fn()} />
        </MuiThemeProvider>
      )
    })

    expect(wrapper.toJSON()).toMatchSnapshot();

    // const result = renderComponent(
    //   <QuitAppDialog open handleClose={jest.fn()} handleQuit={jest.fn()} />
    // )

    // expect(result).toMatchSnapshot()
  })
})
