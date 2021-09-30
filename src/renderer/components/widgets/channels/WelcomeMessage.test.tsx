import React from 'react'
import { shallow } from 'enzyme'
import theme from '../../../theme'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { WelcomeMessage } from './WelcomeMessage'

describe('WelcomeMessage', () => {
  it('renders component', () => {
    const result = shallow(
      <MuiThemeProvider theme={theme}>
        <WelcomeMessage message={'random message'} />
      </MuiThemeProvider>
    )
    expect(result).toMatchSnapshot()
  })
})
