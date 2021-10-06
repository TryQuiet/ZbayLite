import create from '../create'
import whitelistHandlers, { initialState } from './whitelist'
import selectors from '../selectors/whitelist'

describe('Operations reducer handles ', () => {
  let store = null
  beforeEach(() => {
    store = create({
      initialState: {
        whitelist: initialState
      }
    })
    jest.clearAllMocks()
  })

  describe('actions', () => {
    it('- setWhitelistAllFlag', () => {
      store.dispatch(whitelistHandlers.actions.setWhitelistAllFlag(true))
      expect(selectors.allowAll(store.getState())).toEqual(true)
      store.dispatch(whitelistHandlers.actions.setWhitelistAllFlag(false))
      expect(selectors.allowAll(store.getState())).toEqual(false)
    })
    it('- setWhitelist', () => {
      const whitelist = ['test1', 'test2']
      store.dispatch(whitelistHandlers.actions.setWhitelist(whitelist))
      expect(selectors.whitelisted(store.getState())).toEqual(whitelist)
      const whitelist2 = ['test1', 'test2', 'test4']
      store.dispatch(whitelistHandlers.actions.setWhitelist(whitelist2))
      expect(selectors.whitelisted(store.getState())).toEqual(whitelist2)
    })
    it('- setAutoLoadList', () => {
      const autoload = ['test1', 'test2']
      store.dispatch(whitelistHandlers.actions.setAutoLoadList(autoload))
      expect(selectors.autoload(store.getState())).toEqual(autoload)
      const autoload2 = ['test1', 'test2', 'test4']
      store.dispatch(whitelistHandlers.actions.setAutoLoadList(autoload2))
      expect(selectors.autoload(store.getState())).toEqual(autoload2)
    })
  })
})
