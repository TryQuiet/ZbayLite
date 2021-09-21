import * as R from 'ramda'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import JoinCommunityModal from '../../../components/widgets/joinCommunity/JoinCommunityModal'
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
  withModal('JoinCommunityModal')
)(JoinCommunityModal)
