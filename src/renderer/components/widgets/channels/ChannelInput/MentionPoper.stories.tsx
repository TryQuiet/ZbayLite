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
  setInfoClass: function (arg: string): void {},
  id: '',
  users: [{ nickname: 'bartek' }, { nickname: 'emilia' }],
  onChange: function (_arg: string): void {},
  onKeyPress: function (_event: any): void {},
  message: '',
  inputState: INPUT_STATE.AVAILABLE,
  inputPlaceholder: '',
  anchorEl: undefined,
  setAnchorEl: function (_arg: HTMLElement): void {},
  mentionsToSelect: [{ nickname: 'bartek' }, { nickname: 'emilia' }],
  setMentionsToSelect: function (_arg: any[]): void {}
}
