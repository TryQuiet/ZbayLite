
import {createAction, handleActions} from 'redux-actions'
import { actionTypes } from '../../../shared/static'
import { produce, immerable } from 'immer'

import { ActionsType, PayloadType } from './types'

export class Waggle {
    isWaggleConnected: boolean

    constructor(values?: Partial<Waggle>) {
        Object.assign(this, values)
        this[immerable] = true
      }
}

export type WaggleStore = Waggle

export const initialState: Waggle = {
    isWaggleConnected: false
}

const setIsWaggleConnected = createAction<boolean>(actionTypes.SET_IS_WAGGLE_CONNECTED)

export const actions = {
    setIsWaggleConnected
}

export type WaggleActions = ActionsType<typeof actions>

export const epics = {}

export const reducer = handleActions<WaggleStore, PayloadType<WaggleActions>>(
    {
      [setIsWaggleConnected.toString()]: (
        state,
        { payload: isWaggleConnected }: WaggleActions['setIsWaggleConnected']
      ) =>
        produce(state, draft => {
          draft.isWaggleConnected = isWaggleConnected
        })
    },
    initialState
  )

  export default {
    actions,
    epics,
    reducer
  }