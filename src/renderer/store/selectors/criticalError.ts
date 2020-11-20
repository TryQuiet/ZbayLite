import { createSelector } from 'reselect'

import { CriticalErrorStore} from '../handlers/criticalError'

const criticalError = (s): CriticalErrorStore => s.criticalError as CriticalErrorStore

const message = createSelector(criticalError, error => error.message)
const traceback = createSelector(criticalError, error => error.traceback)

export default {
  criticalError,
  message,
  traceback
}
