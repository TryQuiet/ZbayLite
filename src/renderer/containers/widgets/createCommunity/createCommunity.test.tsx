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
import { ModalName } from '../../../sagas/modals/modals.types'
import { screen } from '@testing-library/dom'
import { CreateCommunityDictionary } from '../../../components/widgets/performCommunityAction/PerformCommunityAction.dictionary'

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

test('Create community modal is open and user can see proper title', async () => {
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

  renderComponent(<CreateCommunity />, store)

  const header = CreateCommunityDictionary().header
  const title = await screen.getByText(header)
  expect(title).toBeVisible()


})
