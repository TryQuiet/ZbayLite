import { MessageType } from "../../shared/static";
import BigNumber from "bignumber.js";

export interface IExchangeParticipant {
  replyTo: string;
  username: string;
  publicKey: string;
}
export interface IShippingData {}

export interface IDisplayableMessage {
  id?: string;
  type: MessageType;
  sender: IExchangeParticipant;
  receiver: IExchangeParticipant;
  createdAt?: number;
  message: string;
  spent: BigNumber;
  fromYou: boolean;
  status: string;
  error?: any;
  shippingData?: IShippingData;
  tag: string;
  offerOwner?: string;
  isUnregistered: boolean;
  publicKey?: string;
  blockHeight: number;
}
