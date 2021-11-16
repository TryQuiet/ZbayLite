import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { withTheme } from '../../storybook/decorators'

import ChannelComponent, { ChannelComponentProps } from './Channel'

const Template: ComponentStory<typeof ChannelComponent> = args => {
  return <ChannelComponent {...args} />
}

export const Component = Template.bind({})

const args: ChannelComponentProps = {
  user: {
    id: 'id',
    zbayNickname: 'holmes',
    hiddenService: {
      onionAddress: 'onionAddress',
      privateKey: 'privateKey'
    },
    peerId: {
      id: 'id',
      privKey: 'privKey',
      pubKey: 'pubKey'
    },
    dmKeys: {
      publicKey: 'publicKey',
      privateKey: 'privateKey'
    },
    userCsr: {
      userCsr: 'userCsr',
      userKey: 'userKey',
      pkcs10: {
        publicKey: 'publicKey',
        privateKey: 'privateKey',
        pkcs10: 'pkcs10'
      }
    },
    userCertificate: 'userCertificate'
  },
  channel: {
    name: 'general',
    description: 'This is awesome channel in which you can chat with your friends',
    owner: 'holmes',
    timestamp: 1636971603355,
    address: 'channelAddress'
  },
  channelSettingsModal: {
    open: false,
    handleOpen: function (_args?: any): any {},
    handleClose: function (): any {}
  },
  channelInfoModal: {
    open: false,
    handleOpen: function (_args?: any): any {},
    handleClose: function (): any {}
  },
  messages: [
    {
      id: 'lrqu9mrxj5',
      type: 1,
      message: 'Hello',
      createdAt: '1636971612.539',
      nickname: 'holmes'
    },
    {
      id: 'v4mrwjudxz',
      type: 1,
      message: 'How are you?',
      createdAt: '1636994106.671',
      nickname: 'holmes'
    },
    {
      id: 'gfx8yag8aeu',
      type: 1,
      message: 'Great, thanks!',
      createdAt: '1637063364.29',
      nickname: 'bartek'
    },
  ],
  onDelete: function (): void {},
  onInputChange: function (value: string): void {},
  onInputEnter: function (message: string): void {
    console.log('send message', message)
  },
  mutedFlag: false,
  notificationFilter: '',
  openNotificationsTab: function (): void {}
}

Component.args = args

const component: ComponentMeta<typeof ChannelComponent> = {
  title: 'Components/ChannelComponent',
  decorators: [withTheme],
  component: ChannelComponent
}

export default component
