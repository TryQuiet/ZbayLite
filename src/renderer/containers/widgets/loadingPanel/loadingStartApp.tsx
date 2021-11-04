import React, { useEffect } from 'react'
import LoadingPanelComponent from '../../../components/widgets/loadingPanel/loadingPanel'
import { useModal } from '../../hooks'
import { ModalName } from '../../../sagas/modals/modals.types'
import { useDispatch, useSelector } from 'react-redux'
import { communities } from '@zbayapp/nectar'
import { socketSelectors } from '../../../sagas/socket/socket.selectors'
import { LoadingMessages } from './loadingMessages'

const LoadingStartApp = () => {
  const dispatch = useDispatch()
  const isConnected = useSelector(socketSelectors.isConnected)
  const community = useSelector(communities.selectors.currentCommunity)

  const joinCommunityModal = useModal(ModalName.joinCommunityModal)
  const loadingStartApp = useModal(ModalName.loadingStartApp)

  useEffect(() => {
    if (!community && !loadingStartApp.open && !isConnected) {
      loadingStartApp.handleOpen()
    }
  }, [community, loadingStartApp, dispatch])

  useEffect(() => {
    if (isConnected) {
      loadingStartApp.handleClose()
      joinCommunityModal.handleOpen()
    }
  }, [isConnected])

  return (
    <LoadingPanelComponent
      {...loadingStartApp}
      message={LoadingMessages.StartApp}
    />
  )
}

export default LoadingStartApp
