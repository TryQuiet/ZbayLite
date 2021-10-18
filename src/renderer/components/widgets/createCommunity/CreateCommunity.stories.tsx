import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { withTheme } from '../../../storybook/decorators'

import CreateCommunityComponent, { CreateCommunityComponentProps } from './CreateCommunityComponent'

const Template: ComponentStory<typeof CreateCommunityComponent> = args => {
  return <CreateCommunityComponent {...args} />
}

export const Component = Template.bind({})

const args: CreateCommunityComponentProps = {
  handleCreateCommunity: function (): void {
    console.log('Handle create community')
  },
  initialValue: '',
  handleClose: function (): void {}
}

Component.args = args

const component: ComponentMeta<typeof CreateCommunityComponent> = {
  title: 'Components/CreateCommunity',
  decorators: [withTheme],
  component: CreateCommunityComponent
}

export default component
