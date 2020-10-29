interface IMessage {
  nickname: string;
  createdAt: number;
  address: string;
}

export interface IUserRegisteredMessageProps {
  message: IMessage;
}
