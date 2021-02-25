/* eslint import/first: 0 */
import React from 'react'
import { shallow } from 'enzyme'

import { ImportChannelForm, mapStateToProps, mapDispatchToProps } from './ImportChannelForm'

import create from '../../../store/create'
import { initialState as ImportedChannelState } from '../../../store/handlers/importedChannel'

describe('ImportedChannelForm', () => {
  let store = null
  beforeEach(() => {
    jest.clearAllMocks()
    store = create({
      importedChannel: {
        ...ImportedChannelState,
        // TODO: 07/05 change to Record
        data: {
          name: 'Politics',
          private: true,
          address: 'zs1testaddress',
          description: 'This is a simple test channel',
          keys: {
            ivk: 'this-is-an-ivk-key'
          }
        }
      }
    })
  })

  it('will receive right props', () => {
    const props = mapStateToProps(store.getState())
    expect(props).toMatchSnapshot()
  })

  it('will receive right actions', () => {
    const actions = mapDispatchToProps(x => x)
    expect(actions).toMatchSnapshot()
  })

  it('will render component', () => {
    const props = {
      ...mapStateToProps(store.getState()),
      ...mapDispatchToProps(x => x)
    }
    const result = shallow(<ImportChannelForm {...props} />)
    expect(result).toMatchSnapshot()
  })
})
