import { createSelector } from 'reselect'
import { ModalName } from './modals.types'
import { CreatedSelectors, StoreState } from '../store.types'
import { StoreKeys } from '../../store/store.keys'

const ModalsSlice: CreatedSelectors<StoreState>[StoreKeys.Modals] = (state: StoreState) =>
  state[StoreKeys.Modals]

export const open = (modal: ModalName) =>
  createSelector(ModalsSlice, reducerState => {
    return reducerState[modal]?.open
  })

export const props = (modal: ModalName) =>
  createSelector(ModalsSlice, reducerState => {
    return reducerState[modal]?.args || {}
  })

export const modalsSelectors = {
  open,
  props
}
