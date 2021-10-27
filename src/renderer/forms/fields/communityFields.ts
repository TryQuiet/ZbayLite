import { FieldErrors, CommunityNameErrors, InviteLinkErrors } from '../fieldsErrors'
import { FieldData } from '../types'

export const communityNameField = (name = 'name'): FieldData => {
    return {
      fieldProps: {
        label: 'Community name',
        name,
        type: 'text',
        placeholder: 'Community name'
      },
      validation: {
        required: FieldErrors.Required,
        minLength: {
          value: 3,
          message: CommunityNameErrors.NameToShort
        },
        maxLength: {
          value: 20,
          message: CommunityNameErrors.NameToLong
        },
        pattern: {
          value: /^[a-z0-9]+$/g,
          message: CommunityNameErrors.WrongCharacter
        }
      }
    }
  }
  
  export const inviteLinkField = (name = 'name'): FieldData => {
    return {
      fieldProps: {
        label: 'Paste your invite link to join an existing community',
        name,
        type: 'text',
        placeholder: 'Invite link'
      },
      validation: {
        required: FieldErrors.Required,
        minLength: {
          value: 62,
          message: InviteLinkErrors.NameToShort
        },
        maxLength: {
          value: 69,
          message: InviteLinkErrors.NameToLong
        },
        pattern: {
          value: /^(http:\/\/)?[a-z0-9]+.onion/g,
          message: InviteLinkErrors.WrongCharacter
        }
      }
    }
  }
