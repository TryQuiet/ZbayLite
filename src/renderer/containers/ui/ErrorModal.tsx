import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as R from 'ramda'
import { remote } from 'electron'

import ErrorModal from '../../components/ui/ErrorModal'
import criticalErrorSelectors from '../../store/selectors/criticalError'
import modalsHandlers, { withModal } from '../../store/handlers/modals'
import notificationsHandlers from '../../store/handlers/notifications'
import {
  successNotification,
  errorNotification
} from '../../store/handlers/utils'

export const mapStateToProps = state => ({
  message: criticalErrorSelectors.message(state),
  traceback: criticalErrorSelectors.traceback(state)
})

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      handleExit: modalsHandlers.actionCreators.openModal('quitApp'),
      successSnackbar: () =>
        notificationsHandlers.actions.enqueueSnackbar(
          successNotification({
            message: 'Message has been sent'
          })
        ),
      errorSnackbar: () =>
        notificationsHandlers.actions.enqueueSnackbar(
          errorNotification({
            message: 'There was an error'
          })
        ),
      restartApp: () => {
        remote.app.relaunch()
        remote.app.quit()
      }
    },

    dispatch
  )

export default R.compose(
  React.memo,
  connect(mapStateToProps, mapDispatchToProps),
  withModal('criticalError')
)(ErrorModal)
