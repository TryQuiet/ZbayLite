import '@testing-library/jest-dom'
import { waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { CommunityAction } from '../../../components/widgets/performCommunityAction/community.keys'
import PerformCommunityActionComponent from '../../../components/widgets/performCommunityAction/PerformCommunityActionComponent'
import { renderComponent } from '../../../testUtils/renderComponent'

describe('PerformCommunityAction component (create community mode)', () => {
  const action = CommunityAction.Create

  it('creates community on submit if connection is ready', async () => {
    const handleCommunityAction = jest.fn()
    const component = <PerformCommunityActionComponent
      open={true}
      handleClose={() => {}}
      initialValue={''}
      communityAction={action}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={() => {}}
      isConnectionReady={true}
    />
    const result = renderComponent(component)
    const textInput = result.queryByPlaceholderText('Community name')
    expect(textInput).not.toBeNull()
    userEvent.type(textInput, 'My Community')
    const submitButton = result.queryByRole('button')
    expect(submitButton).not.toBeNull()
    expect(submitButton).toBeEnabled()
    userEvent.click(submitButton)
    await waitFor(() => expect(handleCommunityAction).toBeCalledWith('My Community'))
  })

  it('blocks submit button if connection is not ready', async () => {
    const handleCommunityAction = jest.fn()
    const component = <PerformCommunityActionComponent
      open={true}
      handleClose={() => {}}
      initialValue={''}
      communityAction={action}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={() => {}}
      isConnectionReady={false}
    />
    const result = renderComponent(component)
    const submitButton = result.queryByRole('button')
    expect(submitButton).not.toBeNull()
    expect(submitButton).toBeDisabled()
  })

  it('handles redirection if user clicks on the link', async () => {
    const handleRedirection = jest.fn()
    const handleCommunityAction = jest.fn()
    const component = <PerformCommunityActionComponent
      open={true}
      handleClose={() => {}}
      initialValue={''}
      communityAction={action}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={handleRedirection}
      isConnectionReady={true}
    />
    const result = renderComponent(component)
    const switchLink = result.queryByText('join a community')
    expect(switchLink).not.toBeNull()
    userEvent.click(switchLink)
    expect(handleRedirection).toBeCalled()
    expect(handleCommunityAction).not.toBeCalled()
  })
})

describe('PerformCommunityAction component (join community mode)', () => {
  const action = CommunityAction.Join
  it('joins community on submit if connection is ready', async () => {
    const registrarUrl = 'http://registrarurl.onion'
    const handleCommunityAction = jest.fn()
    const component = <PerformCommunityActionComponent
      open={true}
      handleClose={() => {}}
      initialValue={''}
      communityAction={action}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={() => {}}
      isConnectionReady={true}
    />
    const result = renderComponent(component)
    const textInput = result.queryByPlaceholderText('Invite link')
    expect(textInput).not.toBeNull()
    userEvent.type(textInput, registrarUrl)
    const submitButton = result.queryByRole('button')
    expect(submitButton).not.toBeNull()
    expect(submitButton).toBeEnabled()
    userEvent.click(submitButton)
    await waitFor(() => expect(handleCommunityAction).toBeCalledWith(registrarUrl))
  })

  it('blocks submit button if connection is not ready', async () => {
    const handleCommunityAction = jest.fn()
    const component = <PerformCommunityActionComponent
      open={true}
      handleClose={() => {}}
      initialValue={''}
      communityAction={action}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={() => {}}
      isConnectionReady={false}
    />
    const result = renderComponent(component)
    const textInput = result.queryByPlaceholderText('Invite link')
    expect(textInput).not.toBeNull()
    userEvent.type(textInput, 'My Community')
    const submitButton = result.queryByRole('button')
    expect(submitButton).not.toBeNull()
    expect(submitButton).toBeDisabled()
    expect(handleCommunityAction).not.toBeCalled()
  })

  it('handles redirection if user clicks on the link', async () => {
    const handleRedirection = jest.fn()
    const component = <PerformCommunityActionComponent
      open={true}
      handleClose={() => {}}
      initialValue={''}
      communityAction={action}
      handleCommunityAction={() => {}}
      handleRedirection={handleRedirection}
      isConnectionReady={true}
    />
    const result = renderComponent(component)
    const switchLink = result.queryByText('create a new community')
    expect(switchLink).not.toBeNull()
    userEvent.click(switchLink)
    expect(handleRedirection).toBeCalled()
  })
})
