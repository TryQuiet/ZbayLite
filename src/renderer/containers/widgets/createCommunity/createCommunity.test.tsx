import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { take, put, fork, delay, call } from 'typed-redux-saga'
import { renderComponent } from '../../../testUtils/renderComponent'
import { prepareStore } from '../../../testUtils/prepareStore'
import { StoreKeys } from '../../../store/store.keys'
import { communities } from '@zbayapp/nectar'
import { socketActions, SocketState } from '../../../sagas/socket/socket.slice'
import { ModalsInitialState } from '../../../sagas/modals/modals.slice'
import CreateCommunity from './createCommunity'
import CreateUsernameModal from '../createUsernameModal/CreateUsername'
import { ModalName } from '../../../sagas/modals/modals.types'
import { CreateCommunityDictionary } from '../../../components/widgets/performCommunityAction/PerformCommunityAction.dictionary'
import { Socket } from 'socket.io-client'
import MockedSocket from 'socket.io-mock'
import { act } from 'react-dom/test-utils'
import { ioMock } from '../../../../shared/setupTests'

describe('test', () => {
  let socket: Socket

  beforeEach(() => {
    socket = new MockedSocket()
    ioMock.mockImplementation(() => socket)
  })

  it('User enters community name and is being redirected to username registration after hitting button', async () => {
    const { store, runSaga } = prepareStore(
      {
        [StoreKeys.Socket]: {
          ...new SocketState(),
          isConnected: true
        },
        [StoreKeys.Modals]: {
          ...new ModalsInitialState(),
          [ModalName.createCommunityModal]: { open: true }
        }
      },
      true // Fork Nectar's sagas
    )

    renderComponent(
      <>
        <CreateCommunity />
        <CreateUsernameModal />
      </>,
      store
    )

    await runSaga(mockSocketConnectionSaga).toPromise()

    // Confirm proper modal title is displayed
    const dictionary = CreateCommunityDictionary()
    const createCommunityTitle = screen.getByText(dictionary.header)
    expect(createCommunityTitle).toBeVisible()

    // Enter community name and hit button
    const createCommunityInput = screen.getByPlaceholderText(dictionary.placeholder)
    const createCommunityButton = screen.getByText(dictionary.button)
    userEvent.type(createCommunityInput, 'rockets')
    userEvent.click(createCommunityButton)

    // Confirm user is being redirected to username registration
    const createUsernameTitle = await screen.findByText('Register a username')
    expect(createUsernameTitle).toBeVisible()

    // Enter username and hit button
    const createUsernameInput = await screen.findByPlaceholderText('Enter a username')
    const createUsernameButton = await screen.findByText('Register')
    userEvent.type(createUsernameInput, 'holmes')
    userEvent.click(createUsernameButton)

    await act(async () => {
      await runSaga(testCreateCommunitySaga).toPromise()
    })
  })

  function* mockSocketConnectionSaga(): Generator {
    yield* fork(function* (): Generator {
      yield* delay(1000)
      yield* call(() => {
        // @ts-expect-error
        socket.socketClient.emit('connect')
      })
    })
    yield* put(socketActions.startConnection())
  }

  function* testCreateCommunitySaga(): Generator {
    yield* take(communities.actions.createNewCommunity)
    yield* take(communities.actions.setCurrentCommunity)
  }
})
