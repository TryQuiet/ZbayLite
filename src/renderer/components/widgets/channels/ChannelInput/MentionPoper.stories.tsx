import React, { KeyboardEventHandler } from 'react'
import { storiesOf } from '@storybook/react'
import { withKnobs } from '@storybook/addon-knobs'

import { withStore } from '../../../../storybook/decorators'
import create from '../../../../store/create'
import ChannelInput from './ChannelInput'

import { INPUT_STATE } from '../../../../store/selectors/channel'

const store = create({
  initialState: {}
})

storiesOf('Components/MentionPoper', module)
  .addDecorator(withKnobs)
  .addDecorator(withStore(store))
  .add('playground', () => {
    return (
      <ChannelInput
        infoClass={''}
        setInfoClass={function (arg: string): void {
          throw new Error('Function not implemented.')
        }}
        id={''}
        users={[
            { nickname: 'bartek' },
            { nickname: 'emilia' }
        ]}
        onChange={function (arg: string): void {
          throw new Error('Function not implemented.')
        }}
        onKeyPress={function (event: any): void {
          throw new Error('Function not implemented.')
        }}
        message={''}
        inputState={INPUT_STATE.AVAILABLE}
        inputPlaceholder={''}
        anchorEl={undefined}
        setAnchorEl={function (arg: HTMLElement): void {
          throw new Error('Function not implemented.')
        }}
        mentionsToSelect={[]}
        setMentionsToSelect={function (arg: any[]): void {
          throw new Error('Function not implemented.')
        }}
      />
    )
  })
