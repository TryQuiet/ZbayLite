import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { screen } from '@testing-library/dom'
import { renderComponent } from '../../testUtils/renderComponent'
import { prepareStore } from '../../testUtils/prepareStore'
import { StoreKeys } from '../../store/store.keys'
import {
  identityAdapter,
  storeKeys as NectarStoreKeys,
  channelsByCommunityAdapter,
  communitiesAdapter
} from '@zbayapp/nectar'

import { SocketState } from '../../sagas/socket/socket.slice'
import MockedSocket from 'socket.io-mock'
import { ioMock } from '../../../shared/setupTests'
import { IdentityState } from '@zbayapp/nectar/lib/sagas/identity/identity.slice'
import Channel from './Channel'
import { community, communityChannels, createIdentity } from '../../testUtils/mockedData'
import { CommunitiesState } from '@zbayapp/nectar/lib/sagas/communities/communities.slice'
import { PublicChannelsState } from '@zbayapp/nectar/lib/sagas/publicChannels/publicChannels.slice'

describe('Channel', () => {
  let socket: MockedSocket

  beforeEach(() => {
    socket = new MockedSocket()
    ioMock.mockImplementation(() => socket)
  })

  it("causes no error if there's no data yet", async () => {
    const { store } = await prepareStore(
      {
        [StoreKeys.Socket]: {
          ...new SocketState(),
          isConnected: true
        }
      },
      socket // Fork Nectar's sagas
    )

    renderComponent(
      <>
        <Channel />
      </>,
      store
    )

    const channelName = screen.queryByText('#')
    expect(channelName).toBeNull()
  })

  it('displays properly on app (re)start', async () => {
    const { store } = await prepareStore(
      {
        [StoreKeys.Socket]: {
          ...new SocketState(),
          isConnected: true
        },
        [NectarStoreKeys.Communities]: {
          ...new CommunitiesState(),
          currentCommunity: community.id,
          communities: communitiesAdapter.setAll(communitiesAdapter.getInitialState(), [community])
        },
        [NectarStoreKeys.PublicChannels]: {
          ...new PublicChannelsState(),
          channels: channelsByCommunityAdapter.setAll(
            channelsByCommunityAdapter.getInitialState(),
            [communityChannels]
          )
        },
        [NectarStoreKeys.Identity]: {
          ...new IdentityState(),
          identities: identityAdapter.setAll(identityAdapter.getInitialState(), [createIdentity()])
        }
      },
      socket // Fork Nectar's sagas
    )

    renderComponent(
      <>
        <Channel />
      </>,
      store
    )

    const channelName = screen.getByText('#general')
    expect(channelName).toBeVisible()

    const messageInput = screen.getByPlaceholderText('Message #general as @holmes')
    expect(messageInput).toBeVisible()
  })

  it.todo("immediately shows message that's been written to db")
  it.todo('receives messages from other users')
})
