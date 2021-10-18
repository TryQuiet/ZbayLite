import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'

import { withTheme } from '../../../storybook/decorators'

import TextWithLink, { TextWithLinkProps } from './TextWithLink'

const Template: ComponentStory<typeof TextWithLink> = args => {
  return <TextWithLink {...args} />
}

export const Component = Template.bind({})

const args: TextWithLinkProps = {
  text: 'Here is simple text',
  links: [
    {
      tag: 'simple',
      label: 'simple',
      action: () => {
        console.log('link clicked')
      }
    }
  ]
}

Component.args = args

const component: ComponentMeta<typeof TextWithLink> = {
  title: 'Components/TextWithLink',
  decorators: [withTheme],
  component: TextWithLink
}

export default component