import React, { FC, ReactElement } from 'react'
import { MuiThemeProvider } from '@material-ui/core'

import theme from '../theme'
import { render, Queries, RenderResult } from '@testing-library/react'

export const renderComponent = (ui: ReactElement): RenderResult<Queries, HTMLElement> => {
  const Wrapper: FC = ({ children }) => (
    <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
  )

  return render(ui, { wrapper: Wrapper })
}
