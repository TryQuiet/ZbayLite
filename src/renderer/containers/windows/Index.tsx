import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// import nodeHandlers from '../../store/handlers/node'
import appHandlers from '../../store/handlers/app'
// import nodeSelectors from '../../store/selectors/node'
import { useInterval } from '../hooks'

export const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      // getStatus: () => nodeHandlers.epics.getStatus,
      loadVersion: appHandlers.actions.loadVersion
    },
    dispatch
  )

export const mapStateToProps = _state => ({
  // nodeConnected: nodeSelectors.isConnected(state),
  // bootstrapping: nodeSelectors.bootstrapping(state),
  // bootstrappingMessage: nodeSelectors.bootstrappingMessage(state)
})

export const Index = ({
  getStatus,
  loadVersion
}) => {
  useEffect(() => {
    loadVersion()
  }, [])
  useInterval(getStatus, 5000)
  return <Redirect to='/loading' />
}

Index.propTypes = {
  getStatus: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(Index)
