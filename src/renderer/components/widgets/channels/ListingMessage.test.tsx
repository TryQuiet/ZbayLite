import React from 'react'
import { shallow } from 'enzyme'

import { ListingMessage } from './ListingMessage'
import { DisplayableMessage } from '../../../zbay/messages.types'
import { createMessage } from '../../../testUtils'

describe('SendMessagePopover', () => {
  it('renders popover', async () => {
    const payload = {
      tag: 'dirtyBike',
      offerOwner: 'roks33',
      description: 'Great quality bike for half the price as a name brand dirt bike! The X4',
      title: 'Apollo X4 110cc Dirt Bike for...',
      priceUSD: '300',
      priceZcash: '4000',
      background: '1',
      address: 'test-zcash-address'
    }
    const message = await createMessage()
    const displayableMessage = new DisplayableMessage(message)
    const result = shallow(
      <ListingMessage
        payload={payload}
        buyActions={jest.fn()}
        message={displayableMessage}
      />
    )
    expect(result).toMatchSnapshot()
  })
})
