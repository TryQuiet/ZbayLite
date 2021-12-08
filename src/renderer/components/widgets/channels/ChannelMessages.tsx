import React, { useEffect } from 'react'

import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'

import { Scrollbars } from 'rc-scrollbars'

import MessagesDivider from '../MessagesDivider'
import BasicMessageComponent from './BasicMessage'

import { DisplayableMessage } from '@zbayapp/nectar'

const useStyles = makeStyles(theme => ({
  list: {
    backgroundColor: theme.palette.colors.white,
    padding: '0 4px',
    width: '100%'
  },
  link: {
    color: theme.palette.colors.lushSky,
    cursor: 'pointer'
  },
  info: {
    color: theme.palette.colors.trueBlack,
    letterSpacing: '0.4px'
  },
  root: {
    width: '100%',
    padding: '8px 16px'
  },
  item: {
    backgroundColor: theme.palette.colors.gray03,
    padding: '9px 16px'
  },
  bold: {
    fontWeight: 'bold'
  }
}))

export interface IChannelMessagesProps {
  channel: string
  messages?: {
    count: number
    groups: { [date: string]: DisplayableMessage[][] }
  }
  setChannelLoadingSlice?: (value: number) => void
}

// TODO: scrollbar smart pagination
export const ChannelMessagesComponent: React.FC<IChannelMessagesProps> = ({
  channel,
  messages = {
    count: 0,
    groups: {}
  },
  setChannelLoadingSlice = _value => {}
}) => {
  const classes = useStyles({})

  const chunkSize = 50

  const [scrollPosition, setScrollPosition] = React.useState(-1)

  // Set only top and bottom scroll position (0, 1)
  const [absoluteScrollPosition, setAbsoluteScrollPosition] = React.useState(-1)

  const [messagesSlice, setMessagesSlice] = React.useState(0)

  const messagesRef = React.useRef<HTMLUListElement>()
  const scrollbarRef = React.useRef<Scrollbars>()

  const onScrollFrame = React.useCallback(
    e => {
      // Values betwen 0.0 - 1
      setScrollPosition(e.top)
      // Values 0 or 1
      if (e.top === 0 || e.top === 1) {
        setAbsoluteScrollPosition(e.top)
      } else {
        setAbsoluteScrollPosition(-1)
      }
    },
    [setScrollPosition]
  )

  useEffect(() => {

    // Do this only if scrollbars are visible

    if (scrollbarRef.current && absoluteScrollPosition === 0) { // Scroll sticks to 0 position event when new messages are being loaded
      const trim = Math.max(0, messagesSlice - chunkSize)
      setMessagesSlice(trim)
      setChannelLoadingSlice(trim)
    }

    if (scrollbarRef.current && absoluteScrollPosition === 1) { // Messages doesn't trim automatically
      const totalMessagesAmount = messages.count + messagesSlice
      const bottomMessagesSlice = Math.max(0, totalMessagesAmount - chunkSize)
      setMessagesSlice(bottomMessagesSlice)
      setChannelLoadingSlice(bottomMessagesSlice)
    }

  }, [setChannelLoadingSlice, absoluteScrollPosition])

  /* Scroll to the bottom on entering the channel or resizing window */
  useEffect(() => {
    if (scrollbarRef.current && (scrollPosition === -1 || scrollPosition === 1)) {
      setTimeout(() => {
        scrollbarRef.current?.scrollToBottom()
      })
    }
    const eventListener = () => {
      if (scrollbarRef.current) scrollbarRef.current.scrollToBottom()
    }
    window.addEventListener('resize', eventListener)
    return () => window.removeEventListener('resize', eventListener)
  }, [channel, messages, scrollbarRef])

  return (
    <Scrollbars ref={scrollbarRef} autoHideTimeout={500} onScrollFrame={onScrollFrame}>
      <List disablePadding ref={messagesRef} id='messages-scroll' className={classes.list}>
        {Object.keys(messages.groups).map(day => {
          return (
            <div key={day}>
              <MessagesDivider title={day} />
              {messages.groups[day].map(items => {
                // Messages merged by sender (DisplayableMessage[])
                const data = items[0]
                return <BasicMessageComponent key={data.id} messages={items} />
              })}
            </div>
          )
        })}
      </List>
    </Scrollbars>
  )
}

export default ChannelMessagesComponent
