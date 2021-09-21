import * as R from 'ramda'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import CreateCommunityModal from '../../../components/widgets/createCommunity/CreateCommunityModal'
import { withModal } from '../../../store/handlers/modals'

export const mapStateToProps = state => {
  return {}
}

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      handleSubmit: () => {}
    },
    dispatch
  )

export default R.compose(
  connect(mapStateToProps, mapDispatchToProps),
  withModal('CreateCommunityModal')
)(CreateCommunityModal)
