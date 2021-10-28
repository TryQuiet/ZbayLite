import { FieldErrors } from '../fieldsErrors'
import { FieldData } from '../types'

export const communityAddressField = (
  name = 'communityAddress'
): FieldData => {
  return {
    fieldProps: {
      label: '',
      name,
      type: 'text',
      placeholder: 'Invite link'
    },
    validation: {
      required: FieldErrors.Required
    }
  }
}
