import { ThunkAction } from 'redux-thunk'
import { Action } from 'redux'

class Store {}
interface IThunkActionWithMeta<R, S, E, A extends Action> extends ThunkAction<R, S, E, A> {
  meta?: {
    debounce: {
      time: number
      key: string
    }
  }
}

export type ZbayThunkAction<ReturnType> = IThunkActionWithMeta<
  ReturnType,
  Store,
  unknown,
  Action<string>
>
