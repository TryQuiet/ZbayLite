import React from 'react'
import { bindActionCreators } from 'redux'

import Moderators from '../../../components/widgets/channelSettings/Moderators'
import modalsHandlers from '../../../store/handlers/modals'
import { ModalName } from '../../../sagas/modals/modals.types'
import { useDispatch } from 'react-redux'

const ModeratorsContainer: React.FC = () => {
  const dispatch = useDispatch()
  const { openAddModerator } = bindActionCreators(
    {
      openAddModerator: modalsHandlers.actionCreators.openModal(ModalName.addModerator)
    },
    dispatch
  )

  return <Moderators openAddModerator={openAddModerator} moderators={[]} users={{}} />
}
export default ModeratorsContainer
