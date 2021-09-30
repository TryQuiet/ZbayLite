import { ModalProps } from '@material-ui/core/Modal'
import { PopoverProps } from '@material-ui/core/Popover'
import { History, LocationState } from 'history'

export interface ISendMessagePopoverProps {
  username: string
  handleClose: ModalProps['onClose']
  address: string
  anchorEl?: null | Element | ((element: Element) => Element)
  isUnregistered?: boolean
  createNewContact?: (contact: any) => void
  history?: History<LocationState>
  users?: object
  waggleUsers?: object
  message?: any
}
