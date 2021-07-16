/* eslint import/first: 0 */
import create from '../create'
import selectors from './users'
import { initialState } from '../handlers/identity'

describe('users selectors', () => {
  let store = null
  beforeEach(() => {
    store = create({
      users: {
        address: {
          firstName: 'testname',
          lastName: 'testlastname',
          nickname: 'nickname',
          address:
          'ztestsapling14dxhlp8ps4qmrslt7pcayv8yuyx78xpkrtfhdhae52rmucgqws2zp0zwf2zu6qxjp96lzapsn4r'
        },
        address2: {
          firstName: 'testname2',
          lastName: 'testlastname2',
          nickname: 'nickname2',
          address:
          'ztestsapling14dxhlp8ps4qmrslt7pcayv8yuyx78xpkrtfhdhae52rmucgqws2zp0zwf2zu6qxjp96lzapsn4r'
        },
        myUser: {
          firstName: 'myUserName',
          lastName: 'myUserLastName',
          nickname: 'myUser',
          address:
          'myUserAddres'
        }
      },
      identity: {
        ...initialState,
        data: {
          ...initialState.data,
          signerPubKey: 'myUser'
        }
      }
    })
    jest.clearAllMocks()
  })

  it(' - users', () => {
    expect(selectors.users(store.getState())).toMatchSnapshot()
  })
  it(' - myUser', () => {
    expect(selectors.myUser(store.getState())).toMatchSnapshot()
  })

  it(' - username', () => {
    expect(
      selectors.registeredUser('address')(store.getState())
    ).toMatchSnapshot()
  })
})
