import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { ChannelInput } from './ChannelInput'
import { withTheme } from '../../../../storybook/decorators'

import { INPUT_STATE } from '../../../../store/selectors/channel'

export default {
  title: 'Components/ChannelInpu',
  decorators: [withTheme],
  component: ChannelInput
} as ComponentMeta<typeof ChannelInput>

const Template: ComponentStory<typeof ChannelInput> = args => <ChannelInput {...args} />

export const MentionPoper = Template.bind({})

MentionPoper.args = {
  infoClass: '',
  setInfoClass: function(arg: string): void {
    throw new Error('Function not implemented.')
  },
  id: '',
  users: [{ nickname: 'bartek' }, { nickname: 'emilia' }],
  onChange: function(_arg: string): void {
    throw new Error('Function not implemented.')
  },
  onKeyPress: function(_event: any): void {
    throw new Error('Function not implemented.')
  },
  message: '',
  inputState: INPUT_STATE.AVAILABLE,
  inputPlaceholder: '',
  anchorEl: undefined,
  setAnchorEl: function(_arg: HTMLElement): void {
    throw new Error('Function not implemented.')
  },
  mentionsToSelect: [],
  setMentionsToSelect: function(_arg: any[]): void {
    throw new Error('Function not implemented.')
  }
}
