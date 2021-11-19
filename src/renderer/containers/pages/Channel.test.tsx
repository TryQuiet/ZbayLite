import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { screen } from '@testing-library/dom'
import { apply, take } from 'typed-redux-saga'
import { renderComponent } from '../../testUtils/renderComponent'
import { prepareStore } from '../../testUtils/prepareStore'
import { StoreKeys } from '../../store/store.keys'
import {
  storeKeys as NectarStoreKeys,
  identityAdapter,
  channelsByCommunityAdapter,
  communitiesAdapter,
  publicChannels
} from '@zbayapp/nectar'
import { SocketState } from '../../sagas/socket/socket.slice'
import MockedSocket from 'socket.io-mock'
import { act } from 'react-dom/test-utils'
import { ioMock } from '../../../shared/setupTests'
import { IdentityState } from '@zbayapp/nectar/lib/sagas/identity/identity.slice'
import Channel from './Channel'
import {
  community,
  communityChannels,
  createIdentity,
  generalChannel,
  message1,
  message2,
  socketEventData
} from '../../testUtils/mockedData'
import { CommunitiesState } from '@zbayapp/nectar/lib/sagas/communities/communities.slice'
import { PublicChannelsState } from '@zbayapp/nectar/lib/sagas/publicChannels/publicChannels.slice'
import { SocketActionTypes } from '@zbayapp/nectar/lib/sagas/socket/const/actionTypes'

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

  it.skip('asks for missing messages and displays them', async () => {
    const { store, runSaga } = await prepareStore(
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

    jest.spyOn(socket, 'emit').mockImplementation((action: SocketActionTypes, ...input: any[]) => {
      if (action === SocketActionTypes.ASK_FOR_MESSAGES) {
        const data = input as socketEventData<[string, string, string[]]>
        const communityId = data[0]
        const channelAddress = data[1]
        const ids = data[2]
        if (ids.length > 1) {
          fail('Requested too many massages')
        }
        if (ids[0] !== message2.id) {
          fail('Missing message has not been requested')
        }
        return socket.socketClient.emit(SocketActionTypes.RESPONSE_ASK_FOR_MESSAGES, {
          communityId: communityId,
          channelAddress: channelAddress,
          messages: [message2]
        })
      }
    })

    const persistedMessage = screen.findByText(message1.message)
    expect(persistedMessage).toBeVisible()

    // New message is not yet fetched from db
    const newMessage = screen.queryByTestId(message2.message)
    expect(newMessage).toBeNull()

    await act(async () => {
      await runSaga(mockSendMessagesIds).toPromise()
      await runSaga(testReceiveMessage).toPromise()
    })

    expect(newMessage).toBeVisible()
  })

  function* mockSendMessagesIds(): Generator {
    yield* apply(socket.socketClient, socket.socketClient.emit, [
      SocketActionTypes.SEND_MESSAGES_IDS,
      {
        communityId: community.id,
        channelAddress: generalChannel.address,
        ids: [message2.id]
      }
    ])
  }

  function* testReceiveMessage(): Generator {
    yield* take(publicChannels.actions.askForMessages)
    yield* take(publicChannels.actions.responseAskForMessages)
  }
})
