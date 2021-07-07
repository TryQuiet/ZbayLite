/* global Notification */
import { soundTypeToAudio } from '../shared/sounds'
import electronStore from '../shared/electronStore'
import history from '../../src/shared/history'

export const createNotification = ({ title, body, data }) => {
  const sound = parseInt(electronStore.get('notificationCenter.user.sound'))
  if (sound) {
    soundTypeToAudio[sound].play()
  }
  const notification = new Notification(title, { body: body })
  notification.onclick = () => {
    history.push(data)
  }
  return notification
}

export const displayMessageNotification = ({
  senderName,
  message,
  channelName,
  address = ''
}) => {
  if (!message) {
    return
  }
  return createNotification({
    title: `New message in ${channelName}`,
    body: `${senderName || 'Anonymous'}: ${message &&
      message.substring(0, 64)}${message.length > 64 ? '...' : ''}`,
    data: `/main/channel/${address}`
  })
}

export const displayDirectMessageNotification = ({ message, username }) => {
  if (!message || !message.message) {
    return
  }
  return createNotification({
    title: `New message from ${username || 'Unnamed'}`,
    body: `${message.message.substring(0, 64)}${message.message.length > 64 ? '...' : ''
      }`,
    data: `/main/direct-messages/${message.pubKey}/${username}`
  })
}
export const offerNotification = ({ message, username }) => {
  if (!message) {
    return
  }
  return createNotification({
    title: `New message from ${username || 'Unnamed'}`,
    body: `${message.substring(0, 64)}${message.length > 64 ? '...' : ''}`
  })
}
export default {
  createNotification,
  displayMessageNotification
}
