import React from 'react'
import '@testing-library/jest-dom/extend-expect';
import { combineReducers, createStore } from '@reduxjs/toolkit'
import { communities, identity, users, errors, messages, publicChannels } from '@zbayapp/nectar'
import { socketReducer, SocketState } from '../../../sagas/socket/socket.slice'
import { ModalsInitialState, modalsReducer } from '../../../sagas/modals/modals.slice'
import { StoreKeys as NectarStoreKeys } from '@zbayapp/nectar/lib/sagas/store.keys'
import { StoreKeys } from '../../../store/store.keys'
import { renderComponent } from '../../../testUtils/renderComponent'
import CreateCommunity from './createCommunity'
import CreateUsernameModal from '../createUsernameModal/CreateUsername';
import { ModalName } from '../../../sagas/modals/modals.types'
import { screen } from '@testing-library/dom'
import { CreateCommunityDictionary } from '../../../components/widgets/performCommunityAction/PerformCommunityAction.dictionary'
import userEvent from '@testing-library/user-event';

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
  return createStore(combinedReducers, mockedState)
}

test('User enters community name and is being redirected to username registration after hitting button', async () => {
  const store = prepareStore(reducers, {
      [StoreKeys.Socket]: {
          ...new SocketState(),
          isConnected: true
      },
      [StoreKeys.Modals]: {
          ...new ModalsInitialState(),
          [ModalName.createCommunityModal]: { open: true }
      }
  })

  renderComponent(<><CreateCommunity /><CreateUsernameModal /></>, store)

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
})
