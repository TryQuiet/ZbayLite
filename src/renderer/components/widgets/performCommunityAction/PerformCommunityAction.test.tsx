import '@testing-library/jest-dom';
import { waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { CommunityAction } from "../../../components/widgets/performCommunityAction/community.keys";
import PerformCommunityActionComponent from "../../../components/widgets/performCommunityAction/PerformCommunityActionComponent";
import { renderComponent } from '../../../testUtils/renderComponent';

describe('Create community view', () => {
  const action = CommunityAction.Create

  it('creates community on submit if connection is ready', async () => {
    const handleCommunityAction = jest.fn()
    const hop = <PerformCommunityActionComponent
      open={true}
      handleClose={() => {}}
      initialValue={''}
      communityAction={action}
      handleCommunityAction={handleCommunityAction}
      handleRedirection={() => {}}
      isConnectionReady={true}
    />
      const result = renderComponent(hop)
      const textInput = await result.findByPlaceholderText('Community name') // TOOD: why findByRole('input') does not work?
      userEvent.type(textInput, 'My Community')
      const button = await result.findByRole('button')
      expect(button).toBeEnabled()
      await waitFor(() => userEvent.click(button))
      expect(handleCommunityAction).toBeCalledWith('My Community')
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
      const textInput = await result.findByPlaceholderText('Community name')
      userEvent.type(textInput, 'My Community')
      const button = await result.findByRole('button')
      expect(button).toBeDisabled()
      expect(handleCommunityAction).not.toBeCalled()
  })

  it('switches to "join community" view if user clicks on link', async () => {
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
    const switchLink = await result.findByText('join a community')
    await waitFor(() => userEvent.click(switchLink))
    expect(handleRedirection).toBeCalled()
  })
})

describe('Join community view', () => {
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
      const textInput = await result.findByPlaceholderText('Invite link')
      userEvent.type(textInput, registrarUrl)
      const button = await result.findByRole('button')
      expect(button).toBeEnabled()
      await waitFor(() => userEvent.click(button))
      expect(handleCommunityAction).toBeCalledWith(registrarUrl)
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
      const textInput = await result.findByPlaceholderText('Invite link')
      userEvent.type(textInput, 'My Community')
      const button = await result.findByRole('button')
      expect(button).toBeDisabled()
      expect(handleCommunityAction).not.toBeCalled()
  })

  it('switches to "create community" view if user clicks on link', async () => {
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
    const switchLink = await result.findByText('create a new community')
    await waitFor(() => userEvent.click(switchLink))
    expect(handleRedirection).toBeCalled()
  })
})
