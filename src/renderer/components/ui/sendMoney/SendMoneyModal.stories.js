import React from 'react'
import { storiesOf } from '@storybook/react'
import { boolean, number } from '@storybook/addon-knobs'
import BigNumber from 'bignumber.js'

import SendMoneyModal from './SendMoneyModal'

storiesOf('Components/Widgets/SendMoneyModal', module)
  .add('playground', () => {
    const step = number('Step', 3)
    return (
      <SendMoneyModal
        step={step}
        setStep={() => {}}
        rateUsd={new BigNumber(50)}
        rateZec={new BigNumber(0.4)}
        feeZec={2}
        feeUsd={2}
        balanceZec={new BigNumber(0.7)}
        open={boolean('Disabled', true)}
        sent={boolean('sent', true)}
        handleClose={() => {}}
      />
    )
  })
