import React from "react";
import { unmountComponentAtNode } from "react-dom";
// import { act } from "react-test-renderer";
import { act, render, screen, waitFor } from "@testing-library/react";
import CreateCommunity from '../createCommunity/createCommunity'
import userEvent from "@testing-library/user-event";
import PerformCommunityActionComponent from "../../../components/widgets/performCommunityAction/PerformCommunityActionComponent";
import { CommunityAction } from "../../../components/widgets/performCommunityAction/community.keys";
// import '@testing-library/jest-dom'
import { renderComponent } from '../../../testUtils/renderComponent'

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  // container = <CreateCommunity />
  // document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  // unmountComponentAtNode(container);
  // container.remove();
  container = null;
});

it('creates community on submit', async () => {
  const handleCommunityAction = jest.fn()
  const hop = <PerformCommunityActionComponent
    open={true}
    handleClose={() => {console.log('closeeee')}}
    initialValue={''}
    communityAction={CommunityAction.Create}
    handleCommunityAction={handleCommunityAction}
    handleRedirection={() => {}}
    isConnectionReady={true}
  />
    const result = renderComponent(hop)
    console.log(result.baseElement)
    const textInput = await result.findByPlaceholderText('Community name') // TOOD: why findByRole('input') does not work?
    userEvent.type(textInput, 'My Community')
    const button = await result.findByRole('button')
    await waitFor(() => userEvent.click(button))
    expect(handleCommunityAction).toBeCalledWith('My Community')

    
})