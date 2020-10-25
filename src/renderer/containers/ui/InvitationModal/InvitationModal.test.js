/* eslint import/first: 0 */
import { mapStateToProps, mapDispatchToProps } from './InvitationModal'

import create from '../../../store/create'
import { Invitation } from '../../../store/handlers/invitation'

describe('InvitationModal', () => {
  let store = null
  beforeEach(() => {
    jest.clearAllMocks()
    store = create({
      initialState: {
        criticalError: {
          ...Invitation
        }
      }
    })
  })

  it('will receive right props', async () => {
    const props = mapStateToProps(store.getState())
    expect(props).toMatchSnapshot()
  })

  it('will receive right actions', () => {
    const actions = mapDispatchToProps(x => x)
    expect(actions).toMatchSnapshot()
  })
})
