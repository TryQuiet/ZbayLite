import { createSelector } from 'reselect'
import BigNumber from 'bignumber.js'

import { Store } from '../reducers'

const node = (s: Store) => s.node

const currentBlock = createSelector(node, n => n.currentBlock)
const latestBlock = createSelector(node, n => n.latestBlock)
const connections = createSelector(node, n => n.connections)
const status = createSelector(node, n => n.status)
const percentSynced = createSelector([currentBlock, latestBlock], (current, latest) => {
  if (!latest.isZero()) {
    return current.dividedBy(latest).multipliedBy(100).toFixed(0, BigNumber.ROUND_DOWN)
  }
  return null
})
const network = () => {
  if (parseInt(process.env.ZBAY_IS_TESTNET) === 1) {
    return 'testnet'
  } else {
    return 'mainnet'
  }
}

const isConnected = createSelector(status, s => ['healthy', 'syncing'].includes(s))

const isRescanning = createSelector(node, n => n.isRescanning)
const fetching = createSelector(node, n => n.fetchingStatus)
const bootstrapping = createSelector(node, n => n.loading)
const bootstrappingMessage = createSelector(node, n => n.bootstrappingMessage)
const fetchingPart = createSelector(fetching, n => n.part)
const fetchingSize = createSelector(fetching, n => n.sizeLeft)
const fetchingStatus = createSelector(fetching, n => n.fetchingStatus)
const fetchingSpeed = createSelector(fetching, n => n.fetchingSpeed)
const fetchingEndTime = createSelector(fetching, n => n.fetchingEndTime)
const rescanningProgress = createSelector(fetching, n => n.rescanningProgress)
const isFetching = createSelector(fetching, n => n.isFetching)
const isRescanningMonitorStarted = createSelector(fetching, n => n.isRescanningMonitorStarted)
const isRescanningInitialized = createSelector(fetching, n => n.isRescanningInitialized)
const guideStatus = createSelector(fetching, n => n.guideStatus)
const currentSlide = createSelector(fetching, n => n.currentSlide)

export default {
  node,
  currentBlock,
  latestBlock,
  status,
  connections,
  network,
  percentSynced,
  isConnected,
  bootstrapping,
  bootstrappingMessage,
  fetchingPart,
  fetchingSize,
  fetchingStatus,
  fetchingSpeed,
  isFetching,
  fetchingEndTime,
  rescanningProgress,
  isRescanningMonitorStarted,
  isRescanningInitialized,
  guideStatus,
  currentSlide,
  isRescanning
}
