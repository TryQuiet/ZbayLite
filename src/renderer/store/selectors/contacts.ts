import { createSelector } from "reselect";
import Immutable from "immutable";
import identitySelectors from "./identity";
import directMssagesQueueSelectors from "./directMessagesQueue";
import operationsSelectors from "./operations";
import { operationTypes } from "../handlers/operations";
// import usersSelectors from './users'
import { mergeIntoOne, displayableMessageLimit } from "./channel";
import { MessageType } from "../../../shared/static.types";
import { unknownUserId } from "../../../shared/static";

// import messagesSelectors from './messages'

import { DisplayableMessage } from "../../zbay/messages.types";
import { ContactStore, IContact } from "../handlers/contacts";

export const Contact = Immutable.Record({
  lastSeen: null,
  key: "",
  username: "",
  address: "",
  messages: Immutable.Map(),
  newMessages: Immutable.List(),
  vaultMessages: Immutable.List(),
  offerId: null,
});

const contactBase: IContact = {
  lastSeen: null,
  key: "",
  username: "",
  address: "",
  messages: [],
  newMessages: [],
  vaultMessages: [],
  offerId: null,
};

interface IEl {
  address: string;
}

const contacts = (s): ContactStore => s.contacts as ContactStore;

const contactsList = createSelector(
  contacts,
  identitySelectors.removedChannels,
  (contacts, removedChannels) => {
    if (removedChannels.length > 0) {
      return Array.from(Object.values(contacts)).filter(
        (c) =>
          c.key.length === 66 &&
          c.offerId === null &&
          !removedChannels.includes(c.address)
      );
    }
    return Array.from(Object.values(contacts)).filter(
      (c) => c.key.length === 66 && c.offerId === null
    );
  }
);

const unknownMessages = createSelector(contacts, (contacts) => {
  return Array.from(Object.values(contacts)).filter(
    (c) => c.key === unknownUserId
  );
});

const offerList = createSelector(
  contacts,
  identitySelectors.removedChannels,
  (contacts, removedChannels) => {
    if (removedChannels.length > 0) {
      return Array.from(Object.values(contacts)).filter(
        (c) => !!c.offerId && !removedChannels.includes(c.key)
      );
    }
    return Array.from(Object.values(contacts)).filter((c) => !!c.offerId);
  }
);
const channelsList = createSelector(
  contacts,
  identitySelectors.removedChannels,
  (contacts, removedChannels) => {
    if (removedChannels.length > 0) {
      return Array.from(Object.values(contacts)).filter(
        (c) =>
          c.key.length === 78 &&
          c.offerId === null &&
          !removedChannels.includes(c.address)
      );
    }
    return Array.from(Object.values(contacts)).filter(
      (c) => c.key.length === 78 && c.offerId === null
    );
  }
);

const directMessagesContact = (address) =>
  createSelector(contacts, (c) =>
    Array.from(Object.values(c)).find((el: IEl) => el.address === address)
  );

const contact = (address) =>
  createSelector(contacts, (c) => {
    if (!c[address]) {
      return contactBase;
    } else {
      return c[address];
    }
  });

const messagesSorted = (address) =>
  createSelector(contact(address), (c) => {
    return Array.from<DisplayableMessage>(Object.values(c.messages)).sort(
      (a, b) => b.createdAt - a.createdAt
    );
  });
const messagesSortedDesc = (address) =>
  createSelector(contact(address), (c) => {
    return Array.from<DisplayableMessage>(Object.values(c)).sort(
      (a, b) => a.createdAt - b.createdAt
    );
  });

const messagesLength = (address) =>
  createSelector(contact(address), (c) => {
    return Array.from(Object.values(c.messages)).length;
  });
const messages = (address) =>
  createSelector(
    messagesSorted(address),
    displayableMessageLimit,
    (msgs, limit) => {
      return msgs.slice(0, limit);
    }
  );

const channelSettingsMessages = (address) =>
  createSelector(messagesSortedDesc(address), (msgs) => {
    return msgs.filter((msg) => msg.type === 6);
  });

const channelModerators = (address) =>
  createSelector(directMessages(address), (msgs) => {
    return msgs.channelModerators;
  });


const allMessages = createSelector(contacts, (c) => {
  return Array.from(Object.keys(c)).reduce((acc, t) => {
    const temp = (acc[t] = {
      ...acc,
      ...c[t].messages,
    });
    return temp;
  }, {});
});
const getAdvertById = (txid: string) =>
  createSelector(allMessages, (msgs) => {
    return msgs[txid];
  });
const lastSeen = (address) =>
  createSelector(contact(address), (c) => c.lastSeen);
const username = (address) =>
  createSelector(contact(address), (c) => c.username);
const vaultMessages = (address) =>
  createSelector(contact(address), (c) => c.vaultMessages);
const newMessages = (address) =>
  createSelector(contact(address), (c) => c.newMessages);

export const queuedMessages = (address) =>
  createSelector(
    directMssagesQueueSelectors.queue,
    (queue) =>
      queue.filter((m) => m.recipientAddress === address && m.message.type < 10) //  separate offer messages and direct messages
  );

export const pendingMessages = (address) =>
  createSelector(operationsSelectors.operations, (operations) =>
    operations.filter(
      (o) =>
        o.type === operationTypes.pendingDirectMessage &&
        o.meta.recipientAddress === address &&
        o.meta.message.type < 10 //  separate offer messages and direct messages
    )
  );

const channelOwner = (channelId) =>
  createSelector(channelSettingsMessages(channelId), (msgs) => {
    let channelOwner = null;
    channelOwner = msgs[0] ? msgs[0].publicKey : null;
    for (const msg of msgs) {
      if (channelOwner === msg.publicKey) {
        channelOwner = msg.message.owner;
      }
    }
    return channelOwner;
  });
export interface IDirectMessage {
  visibleMessages: DisplayableMessage[];
  channelModerators: any[];
  messsagesToRemove: DisplayableMessage[];
  blockedUsers: any[]
}

export const directMessages = (address) =>
  createSelector(
    messages(address),
    channelOwner(address),
    (messages, channelOwner: string): IDirectMessage => {
      let channelModerators = [];
      let messsagesToRemove: DisplayableMessage[] = [];
      let blockedUsers = [];
      let visibleMessages: DisplayableMessage[] = [];
      for (const msg of messages.reverse()) {
        switch (msg.type) {
          case MessageType.AD:
            if (!blockedUsers.includes(msg.publicKey)) {
              visibleMessages.push(msg);
            }
            break;
          case MessageType.BASIC:
            if (!blockedUsers.includes(msg.publicKey)) {
              visibleMessages.push(msg);
            }
            break;
          case MessageType.TRANSFER:
            if (!blockedUsers.includes(msg.publicKey)) {
              visibleMessages.push(msg);
            }
            break;
          case MessageType.MODERATION:
            const senderPk = msg.publicKey;
            const moderationType = msg.message.moderationType;
            const moderationTarget = msg.message.moderationTarget;
            if (channelOwner === senderPk && moderationType === "ADD_MOD") {
              channelModerators.push(moderationTarget);
            } else if (
              channelOwner === senderPk &&
              moderationType === "REMOVE_MOD"
            ) {
              const indexToRemove = channelModerators.findIndex(
                (el) => el === moderationTarget
              );
              if (indexToRemove !== -1) {
                channelModerators.splice(indexToRemove, 1);
              }
            } else if (
              (channelOwner === senderPk ||
                channelModerators.includes(senderPk)) &&
              moderationType === "BLOCK_USER"
            ) {
              blockedUsers.push(moderationTarget);
              visibleMessages = visibleMessages.filter(
                (msg) => !blockedUsers.includes(msg.publicKey)
              );
            } else if (
              (channelOwner === senderPk ||
                channelModerators.includes(senderPk)) &&
              moderationType === "UNBLOCK_USER"
            ) {
              const indexToRemove = blockedUsers.findIndex(
                (el) => el === moderationTarget
              );
              if (indexToRemove !== -1) {
                blockedUsers.splice(indexToRemove, 1);
              }
            } else if (
              (channelOwner === senderPk ||
                channelModerators.includes(senderPk)) &&
              moderationType === "REMOVE_MESSAGE"
            ) {
              const indexToRemove = visibleMessages.findIndex(
                (el) => el.id === moderationTarget
              );
              if (indexToRemove !== -1) {
                visibleMessages.splice(indexToRemove, 1);
              }
            } else {
            }
            break;
        }
      }
      // const test = Immutable.fromJS({
      //   channelModerators,
      //   messsagesToRemove,
      //   blockedUsers,
      //   visibleMessages: mergeIntoOne(visibleMessages.reverse())
      // })
      return {
        channelModerators,
        messsagesToRemove,
        blockedUsers,
        visibleMessages: mergeIntoOne(
          visibleMessages.reverse() as DisplayableMessage[]
        ),
      } as IDirectMessage;
    }
  );

export default {
  contacts,
  directMessagesContact,
  queuedMessages,
  channelModerators,
  pendingMessages,
  contact,
  messages,
  directMessages,
  lastSeen,
  vaultMessages,
  username,
  newMessages,
  contactsList,
  channelsList,
  offerList,
  getAdvertById,
  allMessages,
  messagesLength,
  messagesSorted,
  unknownMessages,
};
