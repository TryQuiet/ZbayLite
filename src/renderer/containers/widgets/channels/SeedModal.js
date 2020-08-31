import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'

import { bindActionCreators } from 'redux'

import { withModal } from '../../../store/handlers/modals'
import SeedModalComponent from '../../../components/widgets/channels/SeedModal'
import client from '../../../zcash'
export const mapStateToProps = state => ({})
export const mapDispatchToProps = (dispatch, ownProps) =>
  bindActionCreators({}, dispatch)

export const SeedModal = ({ ...props }) => {
  const [seedWords, setSeedWords] = React.useState(null)
  React.useEffect(async () => {
    const seedData = await client.seed()
    setSeedWords(seedData.seed.split(' '))
  }, [])
  return <SeedModalComponent {...props} seedWords={seedWords} />
}
export default R.compose(
  connect(mapStateToProps, mapDispatchToProps),
  React.memo,
  withModal('seedModal')
)(SeedModal)
