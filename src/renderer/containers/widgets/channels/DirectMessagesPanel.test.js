import { mapStateToProps, mapDispatchToProps } from './DirectMessagesPanel'
import create from '../../../store/create'
import { initialState } from '../../../store/handlers/identity'
describe('ChannelsPanel', () => {
  let store = null

  beforeEach(() => {
    jest.clearAllMocks()
    store = create({
      initialState: {
        contacts: {
          address123: {
            username: 'testusername'
          }
        },
        identity: {
          ...initialState,
          loader: { loading: false }
        }
      }
    })
  })

  it('will receive right props', async () => {
    const props = mapStateToProps(store.getState())
    expect(props).toMatchSnapshot()
  })
  it('will receive right actions', async () => {
    const actions = mapDispatchToProps(x => x)
    expect(actions).toMatchSnapshot()
  })
})
