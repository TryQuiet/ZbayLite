import { createSelector } from "reselect";

import { DirectMessagesQueueStore } from "../handlers/directMessagesQueue";

const store = (s): DirectMessagesQueueStore => s.DirectMessagesQueueStore;

const queue = createSelector(store, (state) => state);

export default {
  queue,
};
