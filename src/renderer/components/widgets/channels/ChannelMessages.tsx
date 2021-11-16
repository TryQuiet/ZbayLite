import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'

import { Scrollbars } from 'rc-scrollbars'
import { DateTime } from 'luxon'

import { loadNextMessagesLimit } from '../../../../shared/static'

import MessagesDivider from '../MessagesDivider'
import BasicMessageComponent from './BasicMessage'

import { DisplayableMessage } from '@zbayapp/nectar/lib/sagas/publicChannels/publicChannels.types'

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
  messages?: DisplayableMessage[]
  newMessagesLoading?: boolean
  setNewMessagesLoading?: (arg: boolean) => void
}

// TODO: scrollbar smart pagination
export const ChannelMessagesComponent: React.FC<IChannelMessagesProps> = ({
  channel,
  messages = [],
  newMessagesLoading,
  setNewMessagesLoading
}) => {
  const classes = useStyles({})

  const [scrollPosition, setScrollPosition] = React.useState(-1)

  const messagesRef = React.useRef<HTMLUListElement>()
  const scrollbarRef = React.useRef<Scrollbars>()

  const onScrollFrame = React.useCallback(
    e => {
      setScrollPosition(e.top)
    },
    [setScrollPosition]
  )

  let groupedMessages: { [key: string]: DisplayableMessage[] }
  if (messages.length !== 0) {
    groupedMessages = messages.reduce(function (item, message: DisplayableMessage) {
      let index: string
      if (message.createdAt.split('').indexOf(',') === -1) {
        index = 'Today'
      } else {
        index = message.createdAt.split(',')[0]
      }
      item[index] = item[index] || []
      item[index].push(message)
      return item
    }, Object.create(null))
  }

  /* Scroll to the bottom on entering the channel or resizing window */
  useEffect(() => {
    if (scrollbarRef.current && (scrollPosition === -1 || scrollPosition === 1)) {
      setTimeout(() => {
        scrollbarRef.current.scrollToBottom()
      })
    }
    const eventListener = () => {
      if (scrollbarRef.current) scrollbarRef.current.scrollToBottom()
    }
    window.addEventListener('resize', eventListener)
    return () => window.removeEventListener('resize', eventListener)
  }, [channel, groupedMessages, scrollbarRef])

  /* Set new position of a scrollbar handle */
  useEffect(() => {
    if (scrollbarRef.current && newMessagesLoading) {
      const oneMessageHeight = scrollbarRef.current.getScrollHeight() / messages.length
      const newMessagesBlockHeight = oneMessageHeight * loadNextMessagesLimit
      setTimeout(() => {
        scrollbarRef.current.scrollTop(newMessagesBlockHeight)
      })
      setNewMessagesLoading(false)
    }
  }, [newMessagesLoading])

  return (
    <Scrollbars ref={scrollbarRef} autoHideTimeout={500} onScrollFrame={onScrollFrame}>
      <List disablePadding ref={messagesRef} id='messages-scroll' className={classes.list}>
        {Object.keys(groupedMessages || []).map(key => {
          const messagesArray = groupedMessages[key]
          const today = DateTime.utc()
          const groupName = key
          const displayTitle = DateTime.fromSeconds(parseInt(key)).hasSame(today, 'day')
            ? 'Today'
            : groupName
          return (
            <>
              <MessagesDivider title={displayTitle} />
              {messagesArray.map(message => {
                return <BasicMessageComponent message={message} />
              })}
            </>
          )
        })}
      </List>
    </Scrollbars>
  )
}

export default ChannelMessagesComponent
