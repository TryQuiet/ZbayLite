import { createSelector } from 'reselect'
import { LogsStore } from '../handlers/logs'

const logs = (s): LogsStore => s.logsData as LogsStore

const applicationLogs = createSelector(logs, a => a.applicationLogs)
const transactionsLogs = createSelector(logs, a => a.transactionLogs)
const nodeLogs = createSelector(logs, a => a.nodeLogs)
const islogsFileLoaded = createSelector(logs, a => a.islogsFileLoaded)
const isLogWindowOpened = createSelector(logs, a => a.isLogWindowOpened)

export default {
  applicationLogs,
  transactionsLogs,
  nodeLogs,
  islogsFileLoaded,
  isLogWindowOpened
}
