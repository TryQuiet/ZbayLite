import React from 'react'
import { Socket } from 'socket.io-client'
import '@testing-library/jest-dom/extend-expect'
import userEvent from '@testing-library/user-event'
import { applyMiddleware, combineReducers, createStore } from '@reduxjs/toolkit'
import { fork, take } from 'typed-redux-saga'
import createSagaMiddleware from 'redux-saga'
import thunk from 'redux-thunk'
import { communities, identity, users, errors, messages, publicChannels } from '@zbayapp/nectar'
import { socketReducer, SocketState } from '../../../sagas/socket/socket.slice'
import { ModalsInitialState, modalsReducer } from '../../../sagas/modals/modals.slice'
import { StoreKeys as NectarStoreKeys } from '@zbayapp/nectar/lib/sagas/store.keys'
import { StoreKeys } from '../../../store/store.keys'
import { renderComponent } from '../../../testUtils/renderComponent'
import CreateCommunity from './createCommunity'
import CreateUsernameModal from '../createUsernameModal/CreateUsername'
import { ModalName } from '../../../sagas/modals/modals.types'
import { screen } from '@testing-library/dom'
import { CreateCommunityDictionary } from '../../../components/widgets/performCommunityAction/PerformCommunityAction.dictionary'

const socket = (jest.fn() as unknown) as Socket

const reducers = {
  [NectarStoreKeys.Communities]: communities.reducer,
  [NectarStoreKeys.Identity]: identity.reducer,
  [NectarStoreKeys.Users]: users.reducer,
  [NectarStoreKeys.Errors]: errors.reducer,
  [NectarStoreKeys.Messages]: messages.reducer,
  [NectarStoreKeys.PublicChannels]: publicChannels.reducer,
  [StoreKeys.Socket]: socketReducer,
  [StoreKeys.Modals]: modalsReducer
}

export const prepareStore = (reducers, mockedState?: { [key in StoreKeys]?: any }) => {
  const combinedReducers = combineReducers(reducers)
  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(
    combinedReducers,
    mockedState,
    applyMiddleware(...[sagaMiddleware, thunk])
  )
  return {
    store,
    runSaga: sagaMiddleware.run
  }
}

describe('test', () => {
  it('User enters community name and is being redirected to username registration after hitting button', async () => {
    const { store, runSaga } = prepareStore(reducers, {
      [StoreKeys.Socket]: {
        ...new SocketState(),
        isConnected: true
      },
      [StoreKeys.Modals]: {
        ...new ModalsInitialState(),
        [ModalName.createCommunityModal]: { open: true }
      }
    })

    renderComponent(
      <>
        <CreateCommunity />
        <CreateUsernameModal />
      </>,
      store
    )

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

    await runSaga(testCreateCommunitySaga).toPromise()
  })
})

function* testCreateCommunitySaga(): Generator {
  yield* fork(communities.sagas, socket)
  yield* take(communities.actions.setCurrentCommunity)
}
