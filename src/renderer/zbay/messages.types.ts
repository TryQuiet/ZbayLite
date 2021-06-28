export interface IOutgoingMetadata {
  memo: string
  memohex: string
}
export interface IExchangeParticipant {
  replyTo: string
  username: string
  publicKey?: string
  address?: string
  nickname?: string
}
export class ExchangeParticipant {
  replyTo: string = ''
  username: string = 'Unnamed'
  publicKey: string = ''
  address: string = ''
  nickname: string = ''

  constructor(values?: Partial<ExchangeParticipant>) {
    Object.assign(this, values)
  }
}
export interface IMessage {
  moderationType?: string
  moderationTarget?: string
  id: string
  type: number
  message: string
  createdAt: number
  channelId: string
  signature: string
  pubKey: string

  memohex?: string
  status?: string
  sender?: IExchangeParticipant
  txid?: string
  amount?: number
  memo?: string
  updateOnlyRegistered?: number
  owner?: string
  tag?: string
  offerOwner?: string
  address?: string
  itemId?: string

}
export class DisplayableMessage {
  id: string
  type: number
  message?: string
  createdAt: number
  signature: string
  pubKey: string
  channelId: string
  sender?: IExchangeParticipant
  tag?: string
  offerOwner?: string
  address?: string
  txid?: string
  amount?: number
  memo?: string
  receiver?: IExchangeParticipant
  owner?: string
  isUnregistered?: boolean

  constructor(
    values: Partial<DisplayableMessage> &
    Pick<
    DisplayableMessage,
    | 'id'
    | 'type'
    | 'createdAt'
    | 'message'
    | 'pubKey'
    | 'signature'
    | 'channelId'
    | 'sender'
    >
  ) {
    Object.assign(this, values)
  }
}
