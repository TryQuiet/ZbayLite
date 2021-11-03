import React from 'react'
import { Socket } from 'socket.io-client'
import '@testing-library/jest-dom/extend-expect'
import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { take } from 'typed-redux-saga'
import { renderComponent } from '../../../testUtils/renderComponent'
import { prepareStore } from '../../../testUtils/prepareStore'
import { StoreKeys } from '../../../store/store.keys'
import { communities } from '@zbayapp/nectar'
import { SocketState } from '../../../sagas/socket/socket.slice'
import { ModalsInitialState } from '../../../sagas/modals/modals.slice'
import CreateCommunity from './createCommunity'
import CreateUsernameModal from '../createUsernameModal/CreateUsername'
import { ModalName } from '../../../sagas/modals/modals.types'
import { CreateCommunityDictionary } from '../../../components/widgets/performCommunityAction/PerformCommunityAction.dictionary'

const socket = (jest.fn() as unknown) as Socket

describe('test', () => {
  it('User enters community name and is being redirected to username registration after hitting button', async () => {
    const { store, runSaga } = prepareStore({
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
  yield* take(communities.actions.setCurrentCommunity)
}
