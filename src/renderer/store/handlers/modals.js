import { produce } from 'immer'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { createAction, handleActions } from 'redux-actions'
import { actionTypes } from '../../../shared/static'

import modalsSelectors from '../selectors/modals'

export const initialState = {
  payloads: {}
}

const openModal = (modalName, data) => createAction(actionTypes.OPEN_MODAL, () => ({
  modalName,
  data
}))

const closeModal = (modalName) => createAction(actionTypes.CLOSE_MODAL, () => modalName)

export const actionCreators = {
  openModal,
  closeModal
}

export const reducer = handleActions({
  [actionTypes.OPEN_MODAL]: (state, { payload }) =>
    produce(state, (draft) => {
      draft[payload.modalName] = true
      draft.payloads = {
        ...draft.payloads,
        [payload.modalName]: payload.data
      }
    }),
  [actionTypes.CLOSE_MODAL]: (state, { payload: modalName }) =>
    produce(state, (draft) => {
      draft[modalName] = false
    })
}, initialState)

export const withModal = (name) => (Component) => {
  const mapStateToProps = state => ({
    open: modalsSelectors.open(name)(state)
  })

  const mapDispatchToProps = dispatch => bindActionCreators({
    handleOpen: openModal(name),
    handleClose: closeModal(name)
  }, dispatch)
  const wrappedDisplayName = Component.displayName || Component.name || 'Component'
  const C = connect(mapStateToProps, mapDispatchToProps)(Component)
  C.displayName = `withModal(${wrappedDisplayName})`
  return C
}

export default {
  reducer,
  actionCreators,
  withModal
}
