import { createSelector } from 'reselect'
import * as R from 'ramda'
import directMssagesQueueSelectors from './directMessagesQueue'

import { OffersStore } from '../handlers/offers'

const offers = (s): OffersStore => s.offers as OffersStore


const filteredOffers = createSelector(
  offers,
  (s) => {
    const filteredOffers = s
    return Array.from(Object.values(filteredOffers)).filter(offer => !R.isNil(offer))
  }
)

const offer = id =>
  createSelector(
    offers,
    a => a.id
  )

export const queuedMessages = id =>
  createSelector(
    directMssagesQueueSelectors.queue,
    queue =>
      queue.filter(
        m => m.offerId === id.substring(0, 64) && m.recipientUsername === id.substring(64)
      )
  )

export const advertMessage = id =>
  createSelector(
    offer(id),
    offer => offer.messages.find(msg => msg.type === 2)
  )

const lastSeen = id =>
  createSelector(
    offer(id),
    ch => ch.lastSeen
  )

const newMessages = id =>
  createSelector(
    offer(id),
    ch => ch.newMessages
  )

export default {
  offers,
  offer,
  filteredOffers,
  lastSeen,
  advertMessage,
  newMessages
}
