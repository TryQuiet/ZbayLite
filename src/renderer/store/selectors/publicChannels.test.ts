/* eslint import/first: 0 */
import create from '../create'
import { _PublicChannelData } from '../handlers/publicChannels'
import selectors from './publicChannels'

describe('operations selectors', () => {
  let store = null
  beforeEach(() => {
    store = create({
      publicChannels: {
        testaddress1: {
          ..._PublicChannelData,
          address: 'testAddress1',
          minFee: '1',
          name: 'testname1',
          description: 'sadadsdsadsa',
          onlyForRegistered: '0',
          owner: 'me',
          keys: { ivk: 'zivks14fgrxnk2f6qhtndxtc23cwy74kuyptq78qen9jq2ts2hnz0e7vrqazzyt1' }
        },
        testaddress2: {
          ..._PublicChannelData,
          address: 'XXXX2',
          minFee: '12',
          name: 'testname2',
          description: 'sadadsdsadsa',
          onlyForRegistered: '1',
          owner: 'you',
          keys: { ivk: 'zivks14fgrxnk2f6qhtndxtc23cwy74kuyptq78qen9jq2ts2hnz0e7vrqazzyt2' }
        }
      }
    })
  })
  jest.clearAllMocks()

  it(' - publicChannels', () => {
    expect(selectors.publicChannels(store.getState())).toMatchSnapshot()
  })

  it(' - publicChannelsByAddress', () => {
    expect(selectors.publicChannelsByAddress('testaddress1')(store.getState())).toMatchSnapshot()
  })
})
