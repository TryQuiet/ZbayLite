import React from 'react'
import PropTypes from 'prop-types'
import * as R from 'ramda'
import { Formik } from 'formik'
import { withStyles } from '@material-ui/core/styles'
import { AutoSizer } from 'react-virtualized'
import { Scrollbars } from 'react-custom-scrollbars'
import * as Yup from 'yup'
import BigNumber from 'bignumber.js'

import { MESSAGE_SIZE } from '../../../zbay/transit'
import { networkFee } from '../../../../shared/static'
import SendMessageInitial from './SendMessageInitial'
import { getBytesSize } from '../../../../shared/helpers'

import Modal from '../Modal'

const styles = theme => ({})

export const formSchema = users => {
  return Yup.object().shape(
    {
      recipient: Yup.mixed()
        .test(
          'match',
          'Wrong address format (You can\'t include message to transparent address) or username does not exist',
          function (string) {
            const isAddressValid = /^zs1[a-z0-9]{75}$/.test(
              string
            )
            const includesNickname = Array.from(Object.values(users))
              .filter(obj => obj.nickname === string)[0]
            return includesNickname || isAddressValid
          }
        )
        .required('Required'),
      memo: Yup.string().test('testSize', 'Your message is too long', function (value) {
        return getBytesSize(value) <= MESSAGE_SIZE
      })
    },
    ['recipient']
  )
}

export const validateForm = () => values => {
  const errors = {}
  if (
    values.memo.length > MESSAGE_SIZE
  ) {
    errors.memo = 'Your message and shipping information are too long'
  }
  if (values.sendAnonymously && values.memo.length === 0) {
    errors.memo = 'You need to include message'
  }
  return errors
}

export const SendMessageMain = ({
  initialValues,
  open,
  users,
  nickname,
  balanceZec,
  userData,
  sendMessageHandler,
  sendPlainTransfer,
  history,
  handleClose,
  feeZec = networkFee,
  openSentFundsModal,
  createNewContact
}) => {
  return (
    <Formik
      enableReinitialize
      onSubmit={(values, { resetForm }) => {
        console.log('dupa submit doesnt work')
        console.log('form submitted')
        const { recipient, sendAnonymously } = values
        console.log(`recipient ${recipient}`)
        console.log(`send Anonymously ${sendAnonymously}`)
        const contact = {
          nickname: recipient.nickname,
          publicKey: recipient.publicKey,
          address: ''
        }
        const includesNickname =
        Array.from(Object.values(users))
          .filter(obj => obj.nickname === recipient)[0] ||
          Array.from(Object.values(users))
            .filter(obj => obj.address === recipient)[0]
        console.log(includesNickname)
        if (includesNickname && !sendAnonymously) {
          createNewContact({
            contact: includesNickname,
            history
          })
        } else {
          createNewContact({
            contact,
            history
          })
          const transferData = {
            amount: values.amountZec,
            destination: includesNickname ? includesNickname.address : values.recipient,
            memo: values.memo
          }
          sendPlainTransfer(transferData)
        }
        resetForm()
      }}
      validationSchema={formSchema(users)}
      initialValues={{
        ...initialValues
      }}
      validate={validateForm({ balanceZec })}
    >
      {({
        values,
        isValid,
        submitForm,
        resetForm,
        errors,
        touched,
        setFieldValue
      }) => {
        return (
          <Modal
            open={open}
            handleClose={handleClose}
          >
            <AutoSizer>
              {({ width, height }) => (
                <Scrollbars
                  autoHideTimeout={500}
                  style={{ width: width, height: height }}
                >
                  <SendMessageInitial
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    values={values}
                    memo={values.memo}
                    users={users}
                    nickname={nickname}
                    balanceZec={balanceZec}
                    isValid={isValid}
                    submitForm={submitForm}
                    resetForm={resetForm}
                    feeZec={feeZec}
                    handleClose={handleClose}
                    amountZec={values.amountZec}
                    amountUsd={values.amountUsd}
                    recipient={values.recipient}
                    openSentFundsModal={openSentFundsModal}
                  />
                </Scrollbars>
              )}
            </AutoSizer>
          </Modal>
        )
      }}
    </Formik>
  )
}

SendMessageMain.propTypes = {
  classes: PropTypes.object.isRequired,
  initialValues: PropTypes.shape({
    recipient: PropTypes.string.isRequired,
    sendAnonymously: PropTypes.bool.isRequired,
    memo: PropTypes.string.isRequired
  }).isRequired,
  balanceZec: PropTypes.instanceOf(BigNumber).isRequired,
  nickname: PropTypes.string.isRequired,
  rateUsd: PropTypes.instanceOf(BigNumber),
  rateZec: PropTypes.number,
  feeZec: PropTypes.number,
  feeUsd: PropTypes.number,
  handleClose: PropTypes.func.isRequired,
  sendPlainTransfer: PropTypes.func.isRequired,
  openSentFundsModal: PropTypes.func.isRequired
}

SendMessageMain.defaultProps = {
  initialValues: {
    recipient: '',
    sendAnonymously: false,
    memo: ''
  }
}

export default R.compose(React.memo, withStyles(styles))(SendMessageMain)
