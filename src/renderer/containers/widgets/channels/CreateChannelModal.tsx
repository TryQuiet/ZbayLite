import React from 'react'

import { useModal } from '../../../store/handlers/modals'
import CreateChannelModal from '../../../components/widgets/channels/CreateChannelModal'

export const CreateChannelModalContainer: React.FC<{}> = () => {
  const modal = useModal('createChannel')
  return <CreateChannelModal {...modal} />
}
export default CreateChannelModalContainer
