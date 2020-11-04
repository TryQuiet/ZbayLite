import { IDisplayableMessage } from "../../../zbay/messages";

export interface IBasicMessageProps {
  message: IDisplayableMessage;
  setActionsOpen: (open: boolean) => void;
  actionsOpen: boolean;
  allowModeration: boolean;
}
