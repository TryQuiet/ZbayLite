import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as R from 'ramda'

import { withModal } from '../../store/handlers/modals'
import QuitAppDialog from '../../components/ui/QuitAppDialog'
import { remote } from 'electron'

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      handleQuit: () => () => {
        remote.app.relaunch()
        remote.app.quit()
      }
    },
    dispatch
  )

export default R.compose(
  connect(null, mapDispatchToProps),
  withModal('quitApp')
)(QuitAppDialog)
