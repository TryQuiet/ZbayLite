import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'

import { withModal } from '../../../store/handlers/modals'
import SeedModal from '../../../components/widgets/channels/SeedModal'

export const mapStateToProps = state => ({})
export const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators({}, dispatch)

export default R.compose(
  connect(mapStateToProps, mapDispatchToProps),
  React.memo,
  withModal('seedModal')
)(SeedModal)
