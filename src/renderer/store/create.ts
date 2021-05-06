import { applyMiddleware, createStore, compose } from 'redux'
import thunk from 'redux-thunk'
import promise from 'redux-promise-middleware'
import createDebounce from 'redux-debounced'
import createSagaMiddleware from 'redux-saga'
import rootSaga from '../sagas/index.saga'

import DevTools from '../DevTools'
import reducers from './reducers'
import { errorsMiddleware } from './middlewares'

const sagaMiddleware = createSagaMiddleware()

export default (initialState = {}) => {
  const store = createStore(
    reducers,
    initialState,
    compose(
      applyMiddleware(...[errorsMiddleware, createDebounce(), sagaMiddleware, thunk, promise()]),
      DevTools.instrument()
    )
  )
  sagaMiddleware.run(rootSaga)
  return store
}
