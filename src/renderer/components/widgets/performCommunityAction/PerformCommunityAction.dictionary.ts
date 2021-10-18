export interface PerformCommunityActionDictionary {
    header: string,
    label: string,
    placeholder: string,
    hint?: string,
    button?: string
}

export const CreateCommunityDictionary = {
    header: 'Create your community',
    label: 'Community name',
    placeholder: 'Community name',
    hint: '',
    button: 'Continue'
}

export const JoinCommunityDictionary = {
    header: 'Join community',
    label: 'Paste your invite link to join an existing community',
    placeholder: 'Invite link',
    hint: '',
    button: 'Continue'
}
