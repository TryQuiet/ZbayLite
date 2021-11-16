import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { screen } from '@testing-library/dom'
import { renderComponent } from '../../../testUtils/renderComponent'
import { prepareStore } from '../../../testUtils/prepareStore'
import { StoreKeys } from '../../../store/store.keys'
import { SocketState } from '../../../sagas/socket/socket.slice'
import LoadingPanel from './loadingPanel'
import JoinCommunity from '../joinCommunity/joinCommunity'
import CreateCommunity from '../createCommunity/createCommunity'
import Channel from '../../pages/Channel'
import {
  CreateCommunityDictionary,
  JoinCommunityDictionary
} from '../../../components/widgets/performCommunityAction/PerformCommunityAction.dictionary'
import MockedSocket from 'socket.io-mock'
import { ioMock } from '../../../../shared/setupTests'
import { Community } from '@zbayapp/nectar/lib/sagas/communities/communities.slice'
import {
  CommunityChannels,
  PublicChannelsState
} from '@zbayapp/nectar/lib/sagas/publicChannels/publicChannels.slice'
import { channelsByCommunityAdapter, IChannelInfo } from '@zbayapp/nectar'
import { publicChannelsAdapter } from '@zbayapp/nectar/lib/sagas/publicChannels/publicChannels.adapter'

const communityId = 'communityId'

const communityPayload = {
  id: communityId,
  registrarUrl: 'ugmx77q2tnm5fliyfxfeen5hsuzjtbsz44tsldui2ju7vl5xj4d447yd:7909',
  name: 'name',
  CA: {
    rootCertString:
      'MIIBTDCB8wIBATAKBggqhkjOPQQDAjASMRAwDgYDVQQDEwdaYmF5IENBMB4XDTEwMTIyODEwMTAxMFoXDTMwMTIyODEwMTAxMFowEjEQMA4GA1UEAxMHWmJheSBDQTBZMBMGByqGSM49AgEGCCqGSM49AwEHA0IABJWQkmtUzYuTVkEaNcA+37kGTevnCM3cxbPNTl7bpOhNBUWCcyfw4Mz//BvbRaQUM9YzXf37vSdZ0Ny7jx5io0mjPzA9MA8GA1UdEwQIMAYBAf8CAQMwCwYDVR0PBAQDAgCGMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDATAKBggqhkjOPQQDAgNIADBFAiEA05xsJ8fNTwP7T6EVDROAGpC9Z4iPlRTjlURE28D1iWoCIGT2nXMZGw9bG2ckeunoHRs0Olp5+Ike6hDPCl2jLe7P',
    rootKeyString:
      'MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgZ3Nr6bD5eAD4+1KGNSr7HvswiPt5u9eq78vyH2L09DKgCgYIKoZIzj0DAQehRANCAASVkJJrVM2Lk1ZBGjXAPt+5Bk3r5wjN3MWzzU5e26ToTQVFgnMn8ODM//wb20WkFDPWM139+70nWdDcu48eYqNJ'
  }
}

const generalChannel: IChannelInfo = {
  name: 'general',
  description: 'description',
  owner: 'holmes',
  timestamp: 1636971603355,
  address: 'general'
}

const communityChannels = new CommunityChannels(communityId)
communityChannels.currentChannel = 'general'
communityChannels.channels = publicChannelsAdapter.setAll(
  publicChannelsAdapter.getInitialState(),
  [generalChannel]
)

describe('Restart app works correctly', () => {
  let socket: MockedSocket

  beforeEach(() => {
    socket = new MockedSocket()
    ioMock.mockImplementation(() => socket)
  })

  it('Displays channel component, not displays join/create community component', async () => {
    const { store } = await prepareStore(
      {
        [StoreKeys.Socket]: {
          ...new SocketState(),
          isConnected: true
        },
        Communities: {
          currentCommunity: communityPayload.id,
          communities: {
            ids: communityPayload.id,
            entities: {
              [communityPayload.id]: new Community({
                id: communityPayload.id,
                CA: communityPayload.CA,
                name: communityPayload.name,
                registrarUrl: communityPayload.registrarUrl
              })
            }
          }
        },
        PublicChannels: {
          ...new PublicChannelsState(),
          channels: channelsByCommunityAdapter.setAll(
            channelsByCommunityAdapter.getInitialState(),
            [communityChannels]
          )
        }
      },
      socket // Fork Nectar's sagas
    )

    renderComponent(
      <>
        <LoadingPanel />
        <JoinCommunity />
        <CreateCommunity />
        <Channel />
      </>,
      store
    )

    const channelName = await screen.findByText('#general')

    const joinDictionary = JoinCommunityDictionary()
    const joinCommunityTitle = screen.queryByText(joinDictionary.header)

    const createDictionary = CreateCommunityDictionary()
    const createCommunityTitle = screen.queryByText(createDictionary.header)

    expect(channelName).toBeVisible()
    expect(joinCommunityTitle).toBeNull()
    expect(createCommunityTitle).toBeNull()
  })
})
