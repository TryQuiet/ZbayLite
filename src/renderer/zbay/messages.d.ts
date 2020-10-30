import { MessageType } from "../../shared/static";
import BigNumber from "bignumber.js";

export interface IExchangeParticipant {
  replyTo: string;
  username: string;
  publicKey: string;
}
export interface IShippingData {}

export interface IMessage {
  moderationType: string;
  moderationTarget: string;
  owner: string;
}

/**
 * 
 export interface IModerationActionsType {
   REMOVE_MESSAGE: string;
   BLOCK_USER: string;
   UNBLOCK_USER: string;
   ADD_MOD: string;
   REMOVE_MOD: string;
   REMOVE_CHANNEL: string;
  }
  */
export interface IDisplayableMessage {
  id?: string;
  type: MessageType;
  sender: IExchangeParticipant;
  receiver: IExchangeParticipant;
  createdAt?: number;
  message: IMessage;
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
