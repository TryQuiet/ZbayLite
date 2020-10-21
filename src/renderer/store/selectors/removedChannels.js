import { createSelector } from 'reselect'
const store = s => s

const removedChannels = createSelector(
  store,
  state => state.emovedChannels
)

export default {
  removedChannels
}
