import Immutable from "immutable";
import { partial } from 'ramda'

import { notifierAction } from "../../components/ui/DismissSnackbarAction";

export const typePending = (name) => `${name}_PENDING`;
export const typeFulfilled = (name) => `${name}_FULFILLED`;
export const typeRejected = (name) => `${name}_REJECTED`;

export interface IErrorNotification extends ISuccessNotification {}

export const errorNotification = ({
  message,
  options,
}: IErrorNotification): IErrorNotification => ({
  message,
  options: {
    persist: false,
    variant: "error",
    action: notifierAction,
    ...options,
  },
});

export interface ISuccessNotification  {
  message: string;
  options?: object;
} 

export const successNotification = ({
  message,
  options,
}: ISuccessNotification): ISuccessNotification => ({
  message,
  options: {
    variant: "success",
    ...options,
  },
});

export interface IInfoNotification extends ISuccessNotification {
  key: string;
}

export const infoNotification = ({
  message,
  options,
  key,
} : IInfoNotification): IInfoNotification => ({
  message,
  key,
  options: {
    variant: "info",
    action: notifierAction,
    persist: true,
    ...options,
  },
});

export const LoaderState = Immutable.Record({
  loading: false,
  message: "",
});

export const LoaderStateStd = {
  loading: false,
  message: "",
};

export const FetchingStateStd = {
  sizeLeft: 0,
  part: "",
  fetchingStatus: "",
  fetchingSpeed: null,
  fetchingEndTime: {
    hours: null,
    minutes: null,
    seconds: null,
  },
  isFetching: false,
  rescanningProgress: 0,
  isRescanningMonitorStarted: false,
  isRescanningInitialized: false,
  guideStatus: false,
  currentSlide: 0,
};

export class FetchingState {
  sizeLeft: number = 0
  part: string = ''
  fetchingStatus: string = ''
  fetchingSpeed?: number // TODO: find type
  fetchingEndTime: {
    hours?: number
    minutes?: number
    seconds?: number
  }
  isFetching: boolean = false
  rescanningProgress: number = 0
  isRescanningMonitorStarted: boolean = false
  isRescanningInitialized: boolean = false
  guideStatus: boolean = false
  currentSlide: number = 0

  constructor(values?: Partial<FetchingState>) {
    Object.assign(this, values)
  }
}

export default {
  typePending,
  typeFulfilled,
  typeRejected,
};
