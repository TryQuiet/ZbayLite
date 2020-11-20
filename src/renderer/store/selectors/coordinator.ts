import { createSelector } from 'reselect'
import {CoordinatorStore} from '../handlers/coordinator'

const coordinator = (s): CoordinatorStore => s.coordinator as CoordinatorStore

const running = createSelector(coordinator, a => a.running)

export default {
  running
}
