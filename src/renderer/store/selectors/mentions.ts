import { createSelector } from 'reselect'
import { MentionsStore } from '../handlers/mentions'

export const mentions = (s): MentionsStore => s.mentions as MentionsStore

export const mentionForChannel = channelId =>
  createSelector(mentions, state => state[channelId] || [])

export default {
  mentions,
  mentionForChannel
}
