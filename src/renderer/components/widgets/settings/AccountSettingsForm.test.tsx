/* eslint import/first: 0 */
import React from 'react'
import { shallow } from 'enzyme'

import { AccountSettingsForm } from './AccountSettingsForm'
import { Identity } from '@zbayapp/nectar/lib/sagas/identity/identity.slice'

describe('AccountSettingsForm', () => {
  it('renders component', () => {
    const user = new Identity({
      id: '',
      hiddenService: { onionAddress: '', privateKey: '' },
      peerId: {
        id: '',
        pubKey: '',
        privKey: ''
      },
      dmKeys: {
        publicKey: '',
        privateKey: ''
      }
    })

    const result = shallow(
      <AccountSettingsForm
        user={user}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
