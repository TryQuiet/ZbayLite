import React, { useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { DateTime } from "luxon";
import * as R from "ramda";
import List from "@material-ui/core/List";
import { makeStyles } from "@material-ui/core/styles";

import { MessageType } from "../../../../shared/static.types";
import ChannelMessage from "../../../containers/widgets/channels/ChannelMessage";
import WelcomeMessage from "./WelcomeMessage";
import RescanMessage from "../../../containers/widgets/channels/RescanMessage";
import ChannelItemTransferMessage from "../../../containers/widgets/channels/ItemTransferMessage";
import ChannelAdMessage from "../../../containers/widgets/channels/ListingMessage";
import MessagesDivider from "../MessagesDivider";
import UserRegisteredMessage from "./UserRegisteredMessage";
import ChannelRegisteredMessage from "./ChannelRegisteredMessage";

import { DisplayableMessage } from "./../../../zbay/messages.types";
import { RecentActors } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  list: {
    backgroundColor: theme.palette.colors.white,
    padding: "0 4px",
    width: "100%",
  },
  link: {
    color: theme.palette.colors.lushSky,
    cursor: "pointer",
  },
}));

const messagesTypesToDisplay = [1, 2, 4, 11, 41];
const welcomeMessages = {
  offer: (item, username) =>
    `This is a private conversation with @${username} about their #${item} offer. Feel free to ask them a question about the product or provide other details about your purchase!`,
  main: `Congrats! You created a channel. You can share the channel link with others by accessing the “•••” menu at the top. Once you're registered as the channel owner (this can take a few minutes) you’ll be able to publish your channel and change its settings. Have a great time!`,
};

/**
 * 
 interface IMessage {
   nickname: string;
  createdAt: number;
  address: string;
  type: number;
  keys: object;
  id: string;
  owner: string;
  name: string;
}
*/
interface IUser {
  nickname: string;
  address: string;
}

interface IChannelMessagesProps {
  messages: Array<DisplayableMessage>;
  isOwner: boolean;
  contactId?: string;
  usersRegistration: Array<any>;
  publicChannelsRegistration: Array<any>;
  isDM?: boolean;
  isRescanned: boolean; //required?;
  isNewUser: boolean; //required?
  setScrollPosition: (arg0?: any) => void;
  scrollPosition: number;
  users: Array<IUser>;
  onLinkedChannel: (arg0: any) => void;
  publicChannels: any;
  onRescan: () => void;
  contentRect: string;
  isInitialLoadFinished: boolean;
  channelId: string
}

// const RefScrollbars = React.forwardRef((props, ref) => {
  // return <Scrollbars {...props} ref={ref}></Scrollbars>;
// });


// TODO: scrollbar smart pagination
export const ChannelMessages: React.FC<IChannelMessagesProps> = ({
  messages,
  isOwner,
  setScrollPosition,
  scrollPosition,
  contactId,
  usersRegistration,
  publicChannelsRegistration,
  users,
  channelId,
  onLinkedChannel,
  publicChannels,
  isRescanned,
  isDM,
  onRescan,
  isNewUser,
}) => {
  const classes = useStyles({});
  // const [lastScrollHeight, setLastScrollHeight] = React.useState(0)
  // if (scrollbarRef.current) {
  //   console.log(scrollbarRef.current.getValues())
  // }


  // const getScrollbarRef = React.useCallback((ref) => {
    // if (ref !== null) {
      // scrollbarRef.current = ref;
      // if ((scrollPosition === -1 || scrollPosition === 1)) {
        // ref.scrollToBottom()
      // }
    // }
  // }, []);


  const onScrollFrame = React.useCallback(
    (e) => {
      setScrollPosition(e.top);
    },
    [setScrollPosition]
  );


  const msgRef = React.useRef<HTMLUListElement>();
  const scrollbarRef = React.useRef<Scrollbars>();
  const [offset, setOffset] = React.useState(0);
  const updateSize = () => {
    setOffset(0);
  };
  React.useEffect(() => {
    window.addEventListener("resize", updateSize);
  }, []);
  // TODO work on scroll behavior
  // React.useEffect(() => {
  //   setTimeout(() => {
  //     setLastScrollHeight(scrollbarRef.current.getScrollHeight())
  //   }, 0)
  // }, [contactId])
  // React.useEffect(() => {
  //   console.log('tick')

  //   if (scrollbarRef.current) {
  //     console.log(scrollbarRef.current)
  //     const currentHeight = scrollbarRef.current.getScrollHeight()
  //     console.log(lastScrollHeight)
  //     console.log(currentHeight)
  //     console.log(`######################`)

  //     setLastScrollHeight(currentHeight)
  //     scrollbarRef.current.scrollTop(currentHeight - lastScrollHeight)
  //   }
  // }, [messages.size])
  let groupedMessages: { [key: string]: DisplayableMessage[] };
  if (messages.length !== 0) {
    groupedMessages = R.groupBy<DisplayableMessage>((msg) => {
      return DateTime.fromFormat(
        DateTime.fromSeconds(msg.createdAt).toFormat("cccc, LLL d"),
        "cccc, LLL d"
      )
        .toSeconds()
        .toString();
    })(
      messages
        .filter((msg) => messagesTypesToDisplay.includes(msg.type))
        .concat(usersRegistration)
        .concat(publicChannelsRegistration)
        .sort((a, b) => a.createdAt - b.createdAt)
    );
  }

  React.useEffect(() => {
    if (scrollbarRef.current && (scrollPosition === -1 || scrollPosition === 1)) {
      console.log(scrollPosition)
      scrollbarRef.current.scrollToBottom();
    }},[channelId, groupedMessages, scrollbarRef, offset]
  )

  React.useEffect(() => {
    if (msgRef.current && scrollbarRef.current) {
      const margin =
        msgRef.current.offsetHeight < scrollbarRef.current.getClientHeight()
          ? scrollbarRef.current.getClientHeight() - msgRef.current.offsetHeight
          : 0;
      setOffset(margin);
    }
  }, [msgRef, scrollbarRef]);

  // let username
  // let tag
  // if (isOffer) {
  //   const msg = messages.toJS()[0]
  //   tag = msg.message.tag
  //   username = msg.sender.username
  //   username = msg.sender.username
  // }fdgf

 

  
   
  // const getScrollbarRef = React.useCallback((ref) => {
  // if (ref !== null) {
    // scrollbarRef.current = ref;
      // if ((scrollPosition === -1 || scrollPosition === 1)) {
        // ref.scrollToBottom()
      // }
    // }
  // }, []);

  return (
    <Scrollbars
      ref={scrollbarRef}
      autoHideTimeout={500}
    >
      <List
        disablePadding
        ref={msgRef}
        id="messages-scroll"
        className={classes.list}
        style={{ marginTop: offset }}
      >
        {isOwner && <WelcomeMessage message={welcomeMessages["main"]} />}
        {!isRescanned && !isDM && <RescanMessage />}
        {/* {isOffer && !showLoader && (
          <WelcomeMessage message={welcomeMessages['offer'](tag, username)} />
        )} */}
        {Object.keys(groupedMessages || []).map((key, i) => {
          const messagesArray = groupedMessages[key];
          const today = DateTime.utc();
          const groupName = DateTime.fromSeconds(parseInt(key)).toFormat(
            "cccc, LLL d"
          );
          const displayTitle = DateTime.fromSeconds(parseInt(key)).hasSame(
            today,
            "day"
          )
            ? "Today"
            : groupName;
          return (
            <>
              <MessagesDivider title={displayTitle} />
              {messagesArray.map((msg) => {
                const MessageComponent = typeToMessageComponent[msg.type];
                if (!msg.type) {
                  if (msg.keys) {
                    return (
                      <ChannelRegisteredMessage
                        message={msg}
                        address={
                          users[msg.owner] ? users[msg.owner].address : ""
                        }
                        username={
                          users[msg.owner]
                            ? users[msg.owner].nickname
                            : `anon${msg.owner.substring(0, 16)}`
                        }
                        onChannelClick={() => {
                          onLinkedChannel(publicChannels[msg.name]);
                        }}
                      />
                    );
                  } else {
                    return <UserRegisteredMessage message={msg} />;
                  }
                }
                return (
                  <MessageComponent
                    key={msg.id}
                    message={msg}
                    contactId={contactId}
                  />
                );
              })}
            </>
          );
        })}
        {isNewUser && (
          <WelcomeMessage
            message={
              <span>
                Welcome to Zbay! To start quickly, Zbay includes username and
                channel registration data in the app itself. To verify this
                data, which takes ~1 hour but may add some security,
                <span className={classes.link} onClick={onRescan}>
                  {" "}
                  restart & re-sync
                </span>
                . Otherwise, say hi and introduce yourself!
              </span>
            }
          />
        )}
      </List>
    </Scrollbars>
  );
};

const typeToMessageComponent = {
  [MessageType.BASIC]: ChannelMessage,
  [MessageType.ITEM_BASIC]: ChannelMessage,
  [MessageType.ITEM_TRANSFER]: ChannelItemTransferMessage,
  [MessageType.TRANSFER]: ChannelItemTransferMessage,
  [MessageType.AD]: ChannelAdMessage,
};

ChannelMessages.defaultProps = {
  messages: [],
  usersRegistration: [],
  publicChannelsRegistration: [],
  isOwner: false,
  isDM: false,
};

export default ChannelMessages;
