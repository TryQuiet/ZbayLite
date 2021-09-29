import React, { ReactElement } from 'react'
import { MuiThemeProvider } from '@material-ui/core'

import renderer from 'react-test-renderer';

import theme from '../theme'

export const renderComponent = (ui: ReactElement) => {
  const wrapper = renderer.create(
    <MuiThemeProvider theme={theme}>{ui}</MuiThemeProvider>
  )
  return wrapper.toJSON
}
